const { getSupabaseAdminClient } = require('../config/supabaseClient');
const fs = require('fs');
const path = require('path');

const FALLBACK_PATH = path.resolve(__dirname, '../data/contact-messages.json');

const writeFallbackMessage = (payload) => {
  const dir = path.dirname(FALLBACK_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const existing = fs.existsSync(FALLBACK_PATH)
    ? JSON.parse(fs.readFileSync(FALLBACK_PATH, 'utf8') || '[]')
    : [];

  const message = {
    id: `fallback-${Date.now()}`,
    ...payload,
    created_at: new Date().toISOString(),
    source: 'file-fallback',
  };

  existing.push(message);
  fs.writeFileSync(FALLBACK_PATH, JSON.stringify(existing, null, 2), 'utf8');

  return message;
};

const submitContactMessage = async (req, res, next) => {
  try {
    const supabase = getSupabaseAdminClient();
    const { name, email, message, phone } = req.body || {};

    if (!name || !email || !message) {
      res.status(400);
      throw new Error('name, email, and message are required');
    }

    const payload = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      message: String(message).trim(),
      phone: phone ? String(phone).trim() : null,
    };

    if (!supabase) {
      const fallbackMessage = writeFallbackMessage(payload);
      return res.status(201).json({
        success: true,
        message: 'Contact message submitted',
        contact: fallbackMessage,
        storage: 'fallback',
      });
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert([payload])
      .select('*')
      .single();

    if (error) {
      if (String(error.message || '').includes('contact_messages')) {
        const fallbackMessage = writeFallbackMessage(payload);
        return res.status(201).json({
          success: true,
          message: 'Contact message submitted',
          contact: fallbackMessage,
          storage: 'fallback',
        });
      }

      res.status(400);
      throw new Error(error.message);
    }

    return res.status(201).json({ success: true, message: 'Contact message submitted', contact: data, storage: 'database' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  submitContactMessage,
};
