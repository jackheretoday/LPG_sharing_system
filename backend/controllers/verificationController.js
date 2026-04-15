const {
  updateVerification,
} = require("../services/trustService");

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
    const userId = req.user?.id;
    const { idDocUrl } = req.body;

    if (!idDocUrl) {
      res.status(400);
      throw new Error("idDocUrl is required");
    }

    const trust = await updateVerification(userId, {
      idDocUrl,
      idStatus: "pending",
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

    return res.status(200).json({
      success: true,
      message: `ID verification ${decision}`,
      trust,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  pinVerify,
  idUpload,
  idReview,
};
