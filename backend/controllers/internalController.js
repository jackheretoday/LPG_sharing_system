const {
  recordExchangeOutcome,
} = require("../services/trustService");

const exchangeCompleted = async (req, res, next) => {
  try {
    const { userId, successful, safetyCompleted, disputed, responseSeconds } = req.body;

    if (!userId) {
      res.status(400);
      throw new Error("userId is required");
    }

    const trust = await recordExchangeOutcome(userId, {
      successful: Boolean(successful),
      safetyCompleted: Boolean(safetyCompleted),
      disputed: Boolean(disputed),
      responseSeconds: Number(responseSeconds || 0),
      emergencyAccepted: true,
    });

    return res.status(200).json({
      success: true,
      message: "Exchange outcome recorded",
      trust,
    });
  } catch (error) {
    return next(error);
  }
};

const emergencyResponseLogged = async (req, res, next) => {
  try {
    const { userId, responseSeconds } = req.body;

    if (!userId) {
      res.status(400);
      throw new Error("userId is required");
    }

    const trust = await recordExchangeOutcome(userId, {
      successful: false,
      safetyCompleted: false,
      disputed: false,
      emergencyAccepted: true,
      responseSeconds: Number(responseSeconds || 0),
    });

    return res.status(200).json({
      success: true,
      message: "Emergency response logged",
      trust,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  exchangeCompleted,
  emergencyResponseLogged,
};
