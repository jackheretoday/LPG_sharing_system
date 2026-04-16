const { getSupabaseAdminClient } = require("../config/supabaseClient");

const getOrCreateConversation = async (currentUserId, otherUserId) => {
  const supabase = getSupabaseAdminClient();
  const { data: participantRows } = await supabase
    .from("conversation_participants")
    .select("conversation_id,user_id")
    .in("user_id", [currentUserId, otherUserId]);

  const grouped = new Map();
  for (const row of participantRows || []) {
    if (!grouped.has(row.conversation_id)) {
      grouped.set(row.conversation_id, new Set());
    }
    grouped.get(row.conversation_id).add(row.user_id);
  }

  for (const [conversationId, users] of grouped.entries()) {
    if (users.has(currentUserId) && users.has(otherUserId)) {
      return conversationId;
    }
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .insert([{}])
    .select("*")
    .single();

  await supabase.from("conversation_participants").insert([
    { conversation_id: conversation.id, user_id: currentUserId },
    { conversation_id: conversation.id, user_id: otherUserId },
  ]);

  return conversation.id;
};

const bootstrapConversation = async (req, res, next) => {
  try {
    const supabase = getSupabaseAdminClient();
    const currentUserId = req.user.id;

    let { data: provider } = await supabase
      .from("users")
      .select("id,name,role,is_verified")
      .neq("id", currentUserId)
      .in("role", ["mechanic", "admin"])
      .limit(1)
      .maybeSingle();

    if (!provider) {
      const { data: fallback } = await supabase
        .from("users")
        .select("id,name,role,is_verified")
        .neq("id", currentUserId)
        .eq("role", "consumer")
        .limit(1)
        .maybeSingle();
      provider = fallback;
    }

    if (!provider) {
      res.status(404);
      throw new Error("No chat partner available");
    }

    const conversationId = await getOrCreateConversation(currentUserId, provider.id);

    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    return res.status(200).json({
      success: true,
      conversationId,
      partner: provider,
      messages: messages || [],
    });
  } catch (error) {
    return next(error);
  }
};

const postMessage = async (req, res, next) => {
  try {
    const supabase = getSupabaseAdminClient();
    const { conversationId } = req.params;
    const { body, messageType = "text", metadata = {} } = req.body || {};

    if (!body) {
      res.status(400);
      throw new Error("body is required");
    }

    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          conversation_id: conversationId,
          sender_id: req.user.id,
          body,
          message_type: messageType,
          metadata,
        },
      ])
      .select("*")
      .single();

    if (error) {
      res.status(400);
      throw new Error(error.message);
    }

    return res.status(201).json({ success: true, message: data });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  bootstrapConversation,
  postMessage,
};
