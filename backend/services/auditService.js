const { getSupabaseAdminClient, hasServiceRole } = require("../config/supabaseClient");

const memoryAuditLogs = [];

const writeMemoryAudit = (entry) => {
  memoryAuditLogs.push({
    id: `mem-${memoryAuditLogs.length + 1}`,
    created_at: new Date().toISOString(),
    ...entry,
  });
};

const writeAuditLog = async ({ actorUserId = null, action, entityType, entityId = null, details = {} }) => {
  if (!action || !entityType) {
    return { stored: false, reason: "missing_required_fields" };
  }

  const payload = {
    actor_user_id: actorUserId,
    action,
    entity_type: entityType,
    entity_id: entityId ? String(entityId) : null,
    details,
  };

  if (!hasServiceRole()) {
    writeMemoryAudit(payload);
    return { stored: true, storageMode: "memory" };
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    writeMemoryAudit(payload);
    return { stored: true, storageMode: "memory" };
  }

  const { error } = await supabase.from("audit_logs").insert(payload);
  if (error) {
    // Fall back to memory when table/schema is incomplete in dev.
    writeMemoryAudit({ ...payload, supabase_error: error.message });
    return { stored: true, storageMode: "memory", fallback: true, error: error.message };
  }

  return { stored: true, storageMode: "supabase" };
};

module.exports = {
  writeAuditLog,
};
