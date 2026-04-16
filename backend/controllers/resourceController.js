const { getSupabaseAdmin } = require('../config/supabaseClient');

const resourceController = {
  createResource: async (req, res) => {
    try {
      const { title, description, location, resource_type, price } = req.body;
      const owner_id = req.user.id;
      const supabase = getSupabaseAdmin();

      const { data, error } = await supabase
        .from('resources')
        .insert([{ title, description, location, resource_type, price, owner_id }])
        .select();

      if (error) throw error;
      res.status(201).json({ success: true, resource: data[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllResources: async (req, res) => {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('resources')
        .select(`*, owner:owner_id(id, email)`)
        .eq('status', 'available');

      if (error) throw error;
      res.status(200).json({ success: true, resources: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  requestResource: async (req, res) => {
    try {
      const { resourceId } = req.params;
      const requester_id = req.user.id;
      const supabase = getSupabaseAdmin();

      const { data, error } = await supabase
        .from('resource_requests')
        .insert([{ resource_id: resourceId, requester_id }])
        .select();

      if (error) throw error;
      
      // Update resource status to 'requested'
      await supabase.from('resources').update({ status: 'requested' }).eq('id', resourceId);

      res.status(200).json({ success: true, requestId: data[0].id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = resourceController;
