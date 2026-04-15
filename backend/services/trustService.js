const {
  getSupabaseAdminClient,
  hasServiceRole,
} = require("../config/supabaseClient");
const {
  findUserById,
  updateUser,
  updateTrust,
  addBadge,
} = require("../models/tempUserStore");

const TRUST_BADGES = {
  VERIFIED_HOUSEHOLD: "verified_household",
  SAFETY_COMPLIANT: "safety_compliant",
  FAST_RESPONDER: "fast_responder",
};

const calculateTrustScore = (metrics) => {
  const totalExchanges = Math.max(Number(metrics.totalExchanges || 0), 1);
  const successfulRate = Number(metrics.successfulExchanges || 0) / totalExchanges;
  const safetyRate = Number(metrics.safetyChecksCompleted || 0) / totalExchanges;
  const responseSpeedScore = Math.max(
    Math.min(1 - Number(metrics.avgResponseSeconds || 0) / 1800, 1),
    0
  );
  const disputeScore = Math.max(
    Math.min(1 - Number(metrics.disputesCount || 0) / totalExchanges, 1),
    0
  );

  return Math.round(
    (0.4 * successfulRate +
      0.25 * safetyRate +
      0.2 * responseSpeedScore +
      0.15 * disputeScore) * 100
  );
};

const deriveBadges = (user, trustMetrics) => {
  const badges = new Set(trustMetrics.badges || []);

  if (
    user.role === "household" &&
    user.isPhoneVerified &&
    trustMetrics.verification?.isPinVerified
  ) {
    badges.add(TRUST_BADGES.VERIFIED_HOUSEHOLD);
  }

  const totalExchanges = Number(trustMetrics.totalExchanges || 0);
  const safetyCompletionRate =
    totalExchanges > 0
      ? Number(trustMetrics.safetyChecksCompleted || 0) / totalExchanges
      : 0;

  if (totalExchanges >= 10 && safetyCompletionRate >= 0.95) {
    badges.add(TRUST_BADGES.SAFETY_COMPLIANT);
  }

  if (
    Number(trustMetrics.acceptedEmergencyRequests || 0) >= 10 &&
    Number(trustMetrics.avgResponseSeconds || 0) <= 300
  ) {
    badges.add(TRUST_BADGES.FAST_RESPONDER);
  }

  return Array.from(badges);
};

const buildMemoryTrustSnapshot = (user) => {
  if (!user) {
    return null;
  }

  const trust = user.trust || {};
  const computedTrustScore = calculateTrustScore(trust);
  const badges = deriveBadges(user, { ...trust, trustScore: computedTrustScore });

  return {
    userId: user.id,
    role: user.role,
    isPhoneVerified: Boolean(user.isPhoneVerified),
    verification: trust.verification || {},
    metrics: {
      totalExchanges: trust.totalExchanges || 0,
      successfulExchanges: trust.successfulExchanges || 0,
      safetyChecksCompleted: trust.safetyChecksCompleted || 0,
      disputesCount: trust.disputesCount || 0,
      acceptedEmergencyRequests: trust.acceptedEmergencyRequests || 0,
      avgResponseSeconds: trust.avgResponseSeconds || 0,
    },
    trustScore: computedTrustScore,
    badges,
  };
};

const getMemoryUserTrust = (userId) => {
  const user = findUserById(userId);
  return buildMemoryTrustSnapshot(user);
};

const updateMemoryTrust = (userId, updates) => {
  const user = findUserById(userId);

  if (!user) {
    return null;
  }

  const currentTrust = user.trust || {};
  const mergedTrust = {
    ...currentTrust,
    ...updates,
  };
  mergedTrust.trustScore = calculateTrustScore(mergedTrust);
  mergedTrust.badges = deriveBadges(user, mergedTrust);
  updateTrust(userId, mergedTrust);
  return buildMemoryTrustSnapshot(findUserById(userId));
};

const getDbClient = () => {
  if (!hasServiceRole()) {
    return null;
  }

  return getSupabaseAdminClient();
};

const getDbUserTrust = async (userId) => {
  const supabase = getDbClient();
  if (!supabase) {
    return null;
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id,name,role,is_phone_verified")
    .eq("id", userId)
    .maybeSingle();

  if (userError || !user) {
    return null;
  }

  const { data: verification } = await supabase
    .from("user_verifications")
    .select("user_id,is_pin_verified,id_status,address_text,pin_code,id_doc_url")
    .eq("user_id", userId)
    .maybeSingle();

  const { data: trustMetrics } = await supabase
    .from("trust_metrics")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const metrics = trustMetrics || {
    total_exchanges: 0,
    successful_exchanges: 0,
    safety_checks_completed: 0,
    disputes_count: 0,
    accepted_emergency_requests: 0,
    avg_response_seconds: 0,
    trust_score: 0,
  };

  const normalizedMetrics = {
    totalExchanges: metrics.total_exchanges,
    successfulExchanges: metrics.successful_exchanges,
    safetyChecksCompleted: metrics.safety_checks_completed,
    disputesCount: metrics.disputes_count,
    acceptedEmergencyRequests: metrics.accepted_emergency_requests,
    avgResponseSeconds: metrics.avg_response_seconds,
    trustScore: calculateTrustScore({
      totalExchanges: metrics.total_exchanges,
      successfulExchanges: metrics.successful_exchanges,
      safetyChecksCompleted: metrics.safety_checks_completed,
      disputesCount: metrics.disputes_count,
      avgResponseSeconds: metrics.avg_response_seconds,
    }),
  };

  const badges = deriveBadges(
    {
      role: user.role,
      isPhoneVerified: user.is_phone_verified,
    },
    {
      ...normalizedMetrics,
      verification: verification || {},
    }
  );

  return {
    userId: user.id,
    role: user.role,
    isPhoneVerified: user.is_phone_verified,
    verification: verification || {},
    metrics: normalizedMetrics,
    trustScore: normalizedMetrics.trustScore,
    badges,
    storageMode: "supabase",
  };
};

const getUserTrustSnapshot = async (userId) => {
  const fromDb = await getDbUserTrust(userId);
  if (fromDb) {
    return fromDb;
  }

  return getMemoryUserTrust(userId);
};

const recomputeTrust = async (userId) => {
  const supabase = getDbClient();

  if (!supabase) {
    return updateMemoryTrust(userId, {});
  }

  const snapshot = await getDbUserTrust(userId);
  if (!snapshot) {
    return null;
  }

  const { metrics } = snapshot;
  const trustScore = calculateTrustScore(metrics);
  const badges = deriveBadges(
    {
      role: snapshot.role,
      isPhoneVerified: snapshot.isPhoneVerified,
    },
    {
      ...metrics,
      verification: snapshot.verification,
      badges: snapshot.badges,
    }
  );

  const { error } = await supabase.from("trust_metrics").upsert(
    {
      user_id: userId,
      total_exchanges: metrics.totalExchanges,
      successful_exchanges: metrics.successfulExchanges,
      safety_checks_completed: metrics.safetyChecksCompleted,
      disputes_count: metrics.disputesCount,
      accepted_emergency_requests: metrics.acceptedEmergencyRequests,
      avg_response_seconds: metrics.avgResponseSeconds,
      trust_score: trustScore,
    },
    { onConflict: "user_id" }
  );

  if (!error) {
    for (const badgeCode of badges) {
      const { data: badge } = await supabase
        .from("badges")
        .select("id")
        .eq("code", badgeCode)
        .maybeSingle();

      if (badge?.id) {
        await supabase.from("user_badges").upsert(
          {
            user_id: userId,
            badge_id: badge.id,
          },
          { onConflict: "user_id,badge_id" }
        );
      }
    }
  }

  return {
    ...snapshot,
    trustScore,
    badges,
    storageMode: "supabase",
  };
};

const updateVerification = async (userId, verificationPatch) => {
  const user = findUserById(userId);
  const supabase = getDbClient();

  if (user) {
    const trust = user.trust || {};
    const currentVerification = trust.verification || {};
    const nextVerification = {
      ...currentVerification,
      ...verificationPatch,
    };

    updateTrust(userId, {
      verification: nextVerification,
    });

    if (supabase) {
      await supabase.from("user_verifications").upsert(
        {
          user_id: userId,
          address_text: nextVerification.addressText || "",
          pin_code: nextVerification.pinCode || "",
          is_pin_verified: Boolean(nextVerification.isPinVerified),
          id_doc_url: nextVerification.idDocUrl || null,
          id_status: nextVerification.idStatus || "not_submitted",
        },
        { onConflict: "user_id" }
      );
    }

    const snapshot = await getUserTrustSnapshot(userId);
    return {
      ...snapshot,
      verification: nextVerification,
    };
  }

  if (!supabase) {
    return null;
  }

  await supabase.from("user_verifications").upsert(
    {
      user_id: userId,
      ...verificationPatch,
    },
    { onConflict: "user_id" }
  );

  return getUserTrustSnapshot(userId);
};

const recordExchangeOutcome = async (userId, payload) => {
  const snapshot = await getUserTrustSnapshot(userId);
  if (!snapshot) {
    return null;
  }

  const nextMetrics = {
    totalExchanges: snapshot.metrics.totalExchanges + 1,
    successfulExchanges:
      snapshot.metrics.successfulExchanges + (payload.successful ? 1 : 0),
    safetyChecksCompleted:
      snapshot.metrics.safetyChecksCompleted + (payload.safetyCompleted ? 1 : 0),
    disputesCount: snapshot.metrics.disputesCount + (payload.disputed ? 1 : 0),
    acceptedEmergencyRequests:
      snapshot.metrics.acceptedEmergencyRequests +
      (payload.emergencyAccepted ? 1 : 0),
    avgResponseSeconds: payload.responseSeconds ?? snapshot.metrics.avgResponseSeconds,
  };

  const supabase = getDbClient();
  if (supabase) {
    await supabase.from("trust_metrics").upsert(
      {
        user_id: userId,
        total_exchanges: nextMetrics.totalExchanges,
        successful_exchanges: nextMetrics.successfulExchanges,
        safety_checks_completed: nextMetrics.safetyChecksCompleted,
        disputes_count: nextMetrics.disputesCount,
        accepted_emergency_requests: nextMetrics.acceptedEmergencyRequests,
        avg_response_seconds: nextMetrics.avgResponseSeconds,
        trust_score: calculateTrustScore(nextMetrics),
      },
      { onConflict: "user_id" }
    );
  }

  updateMemoryTrust(userId, nextMetrics);
  return getUserTrustSnapshot(userId);
};

const applyBadgeByCode = (userId, badgeCode) => {
  const user = findUserById(userId);
  if (!user) {
    return null;
  }

  if (user.trust) {
    addBadge(userId, badgeCode);
    return getMemoryUserTrust(userId);
  }

  return null;
};

module.exports = {
  TRUST_BADGES,
  calculateTrustScore,
  deriveBadges,
  getUserTrustSnapshot,
  recomputeTrust,
  updateVerification,
  recordExchangeOutcome,
  applyBadgeByCode,
};
