const { getSupabaseAdminClient, hasServiceRole } = require("../config/supabaseClient");
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

    let dispute;
    if (hasServiceRole()) {
      const supabase = getSupabaseAdminClient();
      const { data, error } = await supabase
        .from("disputes")
        .insert([
          {
            exchange_id: exchangeId,
            raised_by: req.user.id,
            against_user_id: againstUserId,
            reason,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        dispute = {
          id: data.id,
          exchangeId: data.exchange_id,
          raisedBy: data.raised_by,
          againstUserId: data.against_user_id,
          reason: data.reason,
          status: data.status,
          resolvedBy: data.resolved_by,
          resolvedAt: data.resolved_at,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    }

    if (!dispute) {
      dispute = createDisputeRecord({
        exchangeId,
        raisedBy: req.user.id,
        againstUserId,
        reason,
      });
    }

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
    let disputes = [];

    if (hasServiceRole()) {
      const supabase = getSupabaseAdminClient();
      const { data, error } = await supabase
        .from("disputes")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        disputes = data.map((item) => ({
          id: item.id,
          exchangeId: item.exchange_id,
          raisedBy: item.raised_by,
          againstUserId: item.against_user_id,
          reason: item.reason,
          status: item.status,
          resolvedBy: item.resolved_by,
          resolvedAt: item.resolved_at,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));
      }
    }

    if (disputes.length === 0) {
      disputes = listDisputes();
    }

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

    let dispute = null;
    let updated = null;

    if (hasServiceRole()) {
      const supabase = getSupabaseAdminClient();
      const { data: existing } = await supabase
        .from("disputes")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (existing) {
        dispute = {
          id: existing.id,
          exchangeId: existing.exchange_id,
          raisedBy: existing.raised_by,
          againstUserId: existing.against_user_id,
          reason: existing.reason,
          status: existing.status,
          resolvedBy: existing.resolved_by,
          resolvedAt: existing.resolved_at,
          createdAt: existing.created_at,
          updatedAt: existing.updated_at,
        };

        const { data } = await supabase
          .from("disputes")
          .update({
            status: status || existing.status,
            resolved_by: resolvedBy || existing.resolved_by,
            resolved_at:
              status && ["resolved", "rejected"].includes(status)
                ? new Date().toISOString()
                : existing.resolved_at,
          })
          .eq("id", id)
          .select()
          .single();

        if (data) {
          updated = {
            id: data.id,
            exchangeId: data.exchange_id,
            raisedBy: data.raised_by,
            againstUserId: data.against_user_id,
            reason: data.reason,
            status: data.status,
            resolvedBy: data.resolved_by,
            resolvedAt: data.resolved_at,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };
        }
      }
    }

    if (!dispute) {
      dispute = findDisputeById(id);
      if (!dispute) {
        res.status(404);
        throw new Error("Dispute not found");
      }

      updated = updateDisputeRecord(id, {
        status: status || dispute.status,
        resolvedBy: resolvedBy || dispute.resolvedBy,
        resolvedAt:
          status && ["resolved", "rejected"].includes(status)
            ? new Date().toISOString()
            : dispute.resolvedAt,
      });
    }

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
