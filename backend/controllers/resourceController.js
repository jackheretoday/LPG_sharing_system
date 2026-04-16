const { getSupabaseAdmin } = require('../config/supabaseClient');

const resourceController = {
  createResource: async (req, res) => {
    try {
      const { title, description, location, resource_type, price } = req.body;
      const owner_id = req.user.id;
      const supabase = getSupabaseAdmin();

      if (!supabase) {
        return res.status(503).json({ error: 'Supabase admin client is not configured' });
      }

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
      if (!supabase) {
        return res.status(503).json({ error: 'Supabase admin client is not configured' });
      }

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

      if (!supabase) {
        return res.status(503).json({ error: 'Supabase admin client is not configured' });
      }

      const { data: existing } = await supabase
        .from('resource_requests')
        .select('id')
        .eq('resource_id', resourceId)
        .eq('requester_id', requester_id)
        .in('status', ['requested', 'approved'])
        .maybeSingle();

      if (existing?.id) {
        return res.status(200).json({ success: true, requestId: existing.id, duplicate: true });
      }

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
  },

  getMyRequests: async (req, res) => {
    try {
      const requester_id = req.user.id;
      const supabase = getSupabaseAdmin();

      if (!supabase) {
        return res.status(503).json({ error: 'Supabase admin client is not configured' });
      }

      const { data: requests, error: requestError } = await supabase
        .from('resource_requests')
        .select('id,resource_id,status,created_at')
        .eq('requester_id', requester_id)
        .order('created_at', { ascending: false });

      if (requestError) throw requestError;

      const resourceIds = [...new Set((requests || []).map((item) => item.resource_id).filter(Boolean))];
      const { data: resources, error: resourceError } = resourceIds.length
        ? await supabase
            .from('resources')
            .select('id,title,description,location,resource_type,price,status,owner_id,latitude,longitude')
            .in('id', resourceIds)
        : { data: [], error: null };

      if (resourceError) throw resourceError;

      const ownerIds = [...new Set((resources || []).map((item) => item.owner_id).filter(Boolean))];
      const { data: owners, error: ownerError } = ownerIds.length
        ? await supabase
            .from('users')
            .select('id,name,email')
            .in('id', ownerIds)
        : { data: [], error: null };

      if (ownerError) throw ownerError;

      const resourcesById = new Map((resources || []).map((item) => [item.id, item]));
      const ownersById = new Map((owners || []).map((item) => [item.id, item]));

      const enriched = (requests || []).map((item) => {
        const resource = resourcesById.get(item.resource_id) || null;
        const owner = resource?.owner_id ? ownersById.get(resource.owner_id) || null : null;

        return {
          id: item.id,
          status: item.status,
          created_at: item.created_at,
          resource: resource
            ? {
                ...resource,
                owner: owner
                  ? {
                      id: owner.id,
                      name: owner.name || owner.email || 'Unknown owner',
                      email: owner.email || '',
                    }
                  : null,
              }
            : null,
        };
      });

      return res.status(200).json({ success: true, requests: enriched });
    } catch (error) {
      return res.status(500).json({ error: error.message || 'Failed to fetch requests' });
    }
  }
};

module.exports = resourceController;
