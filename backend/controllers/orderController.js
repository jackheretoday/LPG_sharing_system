const { getSupabaseAdmin } = require('../config/supabaseClient');

const orderController = {
  createOrder: async (req, res) => {
    try {
      const { seller_name, fill_level, price, buyer_id } = req.body;
      const supabase = getSupabaseAdmin();
      
      const tracking_id = `GS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const { data, error } = await supabase
        .from('orders')
        .insert([
          { 
            buyer_id, 
            seller_name, 
            fill_level, 
            price, 
            status: 'confirmed',
            tracking_id 
          }
        ])
        .select();

      if (error) throw error;

      res.status(201).json({
        message: 'Order placed successfully',
        order: data[0]
      });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  },

  getUserOrders: async (req, res) => {
    try {
      const { userId } = req.params;
      const supabase = getSupabaseAdmin();

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }
};

module.exports = orderController;
