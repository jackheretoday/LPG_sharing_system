const {
  createDisputeRecord,
  listDisputes,
  findDisputeById,
  updateDisputeRecord,
} = require("../models/tempDisputeStore");
const { writeAuditLog } = require("../services/auditService");

const createDispute = async (req, res, next) => {
  try {
    const { exchangeId, againstUserId, reason } = req.body;

    if (!exchangeId || !againstUserId || !reason) {
      res.status(400);
      throw new Error("exchangeId, againstUserId and reason are required");
    }

    const dispute = createDisputeRecord({
      exchangeId,
      raisedBy: req.user.id,
      againstUserId,
      reason,
    });

    await writeAuditLog({
      actorUserId: req.user?.id || null,
      action: "dispute.create",
      entityType: "disputes",
      entityId: dispute.id,
      details: {
        exchangeId,
        againstUserId,
        reason,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Dispute created",
      dispute,
    });
  } catch (error) {
    return next(error);
  }
};

const getDisputes = async (req, res, next) => {
  try {
    const disputes = listDisputes();
    return res.status(200).json({
      success: true,
      count: disputes.length,
      disputes,
    });
  } catch (error) {
    return next(error);
  }
};

const updateDispute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resolvedBy } = req.body;

    const dispute = findDisputeById(id);
    if (!dispute) {
      res.status(404);
      throw new Error("Dispute not found");
    }

    const updated = updateDisputeRecord(id, {
      status: status || dispute.status,
      resolvedBy: resolvedBy || dispute.resolvedBy,
      resolvedAt:
        status && ["resolved", "rejected"].includes(status)
          ? new Date().toISOString()
          : dispute.resolvedAt,
    });

    await writeAuditLog({
      actorUserId: req.user?.id || null,
      action: "dispute.update",
      entityType: "disputes",
      entityId: id,
      details: {
        previousStatus: dispute.status,
        status: updated?.status,
        resolvedBy: updated?.resolvedBy || null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Dispute updated",
      dispute: updated,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createDispute,
  getDisputes,
  updateDispute,
};
