const {
  getUserTrustSnapshot,
  listProviderTrustSnapshots,
  recomputeTrust,
  applyTrustOverride,
} = require("../services/trustService");
const { findUserById } = require("../models/tempUserStore");
const { writeAuditLog } = require("../services/auditService");

const getMyTrust = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const trust = await getUserTrustSnapshot(userId);

    if (!trust) {
      res.status(404);
      throw new Error("Trust profile not found");
    }

    return res.status(200).json({
      success: true,
      trust,
    });
  } catch (error) {
    return next(error);
  }
};

const getUserTrust = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const trust = await getUserTrustSnapshot(userId);

    if (!trust) {
      res.status(404);
      throw new Error("Trust profile not found");
    }

    return res.status(200).json({
      success: true,
      trust,
    });
  } catch (error) {
    return next(error);
  }
};

const listProviders = async (req, res, next) => {
  try {
    const providers = await listProviderTrustSnapshots();

    return res.status(200).json({
      success: true,
      count: providers.length,
      providers,
    });
  } catch (error) {
    return next(error);
  }
};

const recomputeUserTrust = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = findUserById(userId);
    const trust = await recomputeTrust(userId);

    if (!trust) {
      res.status(404);
      throw new Error("Unable to recompute trust for this user");
    }

    await writeAuditLog({
      actorUserId: req.user?.id || null,
      action: "trust.recompute",
      entityType: "trust_metrics",
      entityId: userId,
      details: {
        trustScore: trust.trustScore,
        badges: trust.badges,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Trust score recomputed",
      user: user
        ? {
            id: user.id,
            name: user.name,
            role: user.role,
          }
        : { id: userId },
      trust,
    });
  } catch (error) {
    return next(error);
  }
};

const overrideUserTrust = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { trustScore, reason } = req.body || {};

    if (trustScore === undefined || trustScore === null) {
      res.status(400);
      throw new Error("trustScore is required");
    }

    const result = await applyTrustOverride({
      userId,
      trustScore,
      reason: reason || "manual_override",
    });

    if (!result) {
      res.status(404);
      throw new Error("User not found");
    }

    await writeAuditLog({
      actorUserId: req.user?.id || null,
      action: "trust.override",
      entityType: "trust_metrics",
      entityId: userId,
      details: {
        trustScore: Number(trustScore),
        reason: reason || "manual_override",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Trust override applied",
      user: result.user,
      trust: result.trust,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMyTrust,
  getUserTrust,
  listProviders,
  recomputeUserTrust,
  overrideUserTrust,
};
