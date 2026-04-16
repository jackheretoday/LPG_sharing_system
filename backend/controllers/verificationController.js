const {
  updateVerification,
  listPendingIdReviews,
} = require("../services/trustService");
const { writeAuditLog } = require("../services/auditService");
const { idVerificationSchema } = require("../utils/validators");

const pinVerify = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { pinCode, addressText } = req.body;

    if (!pinCode) {
      res.status(400);
      throw new Error("pinCode is required");
    }

    const trust = await updateVerification(userId, {
      pinCode,
      addressText: addressText || "",
      isPinVerified: true,
    });

    await writeAuditLog({
      actorUserId: userId,
      action: "verification.pin_verify",
      entityType: "user_verifications",
      entityId: userId,
      details: {
        pinCode,
        hasAddress: Boolean(addressText),
      },
    });

    return res.status(200).json({
      success: true,
      message: "PIN verified",
      trust,
    });
  } catch (error) {
    return next(error);
  }
};

const idUpload = async (req, res, next) => {
  try {
    const validated = idVerificationSchema.safeParse(req.body);
    if (!validated.success) {
      res.status(400);
      throw new Error(validated.error.errors[0].message);
    }

    const { idDocUrl } = validated.data;
    const userId = req.user?.id;

    const trust = await updateVerification(userId, {
      idDocUrl,
      idStatus: "pending",
    });

    await writeAuditLog({
      actorUserId: userId,
      action: "verification.id_upload",
      entityType: "user_verifications",
      entityId: userId,
      details: {
        idDocUrl,
      },
    });

    return res.status(200).json({
      success: true,
      message: "ID submitted for review",
      trust,
    });
  } catch (error) {
    return next(error);
  }
};

const idReview = async (req, res, next) => {
  try {
    const { userId, decision } = req.body;

    if (!userId || !decision) {
      res.status(400);
      throw new Error("userId and decision are required");
    }

    if (!["approved", "rejected"].includes(decision)) {
      res.status(400);
      throw new Error("decision must be approved or rejected");
    }

    const trust = await updateVerification(userId, {
      idStatus: decision,
    });

    await writeAuditLog({
      actorUserId: req.user?.id || null,
      action: "verification.id_review",
      entityType: "user_verifications",
      entityId: userId,
      details: {
        decision,
      },
    });

    return res.status(200).json({
      success: true,
      message: `ID verification ${decision}`,
      trust,
    });
  } catch (error) {
    return next(error);
  }
};

const getIdReviewQueue = async (req, res, next) => {
  try {
    const queue = await listPendingIdReviews();

    return res.status(200).json({
      success: true,
      count: queue.length,
      queue,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  pinVerify,
  idUpload,
  idReview,
  getIdReviewQueue,
};
