const { getSupabaseAdmin } = require('../config/supabaseClient');
const { applyTrustOverride, createSystemAlert } = require('./trustService');

const escalationService = {
  /**
   * Scans for disputes that haven't been resolved within the threshold.
   * Threshold is currently 72 hours (3 days).
   */
  processStaleDisputes: async () => {
    const supabase = getSupabaseAdmin();
    if (!supabase) return { error: 'Supabase client not available' };

    const STALE_THRESHOLD_HOURS = 72;
    const now = new Date();
    const thresholdDate = new Date(now.getTime() - STALE_THRESHOLD_HOURS * 60 * 60 * 1000).toISOString();

    // 1. Find open disputes with no activity for 72+ hours
    const { data: disputes, error } = await supabase
      .from('disputes')
      .select('*')
      .eq('status', 'open')
      .lt('last_activity_at', thresholdDate);

    if (error) throw error;

    const results = [];

    for (const dispute of disputes || []) {
      const respSide = dispute.responsible_party_side; // 'buyer' or 'seller'
      const userId = respSide === 'buyer' ? dispute.buyer_id : dispute.seller_id;
      const currentLevel = dispute.escalation_level || 0;

      let actionTaken = 'none';

      if (currentLevel === 0) {
        // Warning Level
        actionTaken = 'sent_warning';
        await supabase.from('disputes').update({ escalation_level: 1, last_activity_at: now.toISOString() }).eq('id', dispute.id);
        await createSystemAlert(userId, `Warning: Your dispute #${dispute.id} is stagnant. Please resolve it to avoid trust score penalties.`, 'warning');
      } else if (currentLevel === 1) {
        // Penalty Level: Trust Score Decay
        actionTaken = 'trust_decay_applied';
        const reduction = -10;
        
        await createSystemAlert(userId, `Critical: Your trust score has been reduced by 10% due to an unresolved dispute.`, 'error');

        // Log the trust penalty
        await supabase.from('trust_audit_logs').insert([{
          user_id: userId,
          change_amount: reduction,
          reason: `Stale Dispute Escalation #${dispute.id}`,
          linked_dispute_id: dispute.id
        }]);

        // Apply the actual trust score change
        const currentTrust = await supabase.from('trust_metrics').select('trust_score').eq('user_id', userId).maybeSingle();
        const newScore = Math.max(0, (currentTrust?.data?.trust_score || 50) + reduction);
        
        await applyTrustOverride({
          userId,
          trustScore: newScore,
          reason: `Auto-penalty: Stale Dispute #${dispute.id}`
        });

        await supabase.from('disputes').update({ escalation_level: 2, last_activity_at: now.toISOString() }).eq('id', dispute.id);
      } else if (currentLevel >= 2) {
        // Suspension Level
        actionTaken = 'user_suspended';
        await supabase.from('users').update({ is_suspended: true }).eq('id', userId);
        await supabase.from('disputes').update({ escalation_level: 3, last_activity_at: now.toISOString() }).eq('id', dispute.id);
      }

      results.push({ disputeId: dispute.id, action: actionTaken, userId });
    }

    return results;
  }
};

module.exports = escalationService;
