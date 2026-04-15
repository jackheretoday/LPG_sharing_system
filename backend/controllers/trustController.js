const {
  getUserTrustSnapshot,
  recomputeTrust,
} = require("../services/trustService");
const { findUserById } = require("../models/tempUserStore");

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

const recomputeUserTrust = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = findUserById(userId);
    const trust = await recomputeTrust(userId);

    if (!trust) {
      res.status(404);
      throw new Error("Unable to recompute trust for this user");
    }

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

module.exports = {
  getMyTrust,
  getUserTrust,
  recomputeUserTrust,
};
