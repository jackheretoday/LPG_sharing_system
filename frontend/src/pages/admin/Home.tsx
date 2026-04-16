import { useEffect, useMemo, useState } from 'react';
import { RoleHub, type FeatureCard } from '@/components/RoleHub';
import { trustApi } from '@/lib/trustApi';
import { ProtectedRoute } from '@/components/trust/ProtectedRoute';

function AdminHomeContent() {
  const [loading, setLoading] = useState(true);
  const [pendingDisputes, setPendingDisputes] = useState(0);
  const [idQueue, setIdQueue] = useState(0);
  const [suspendedUsers, setSuspendedUsers] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const [disputesRes, queueRes, providersRes] = await Promise.all([
          trustApi.listDisputes(),
          trustApi.listIdReviewQueue(),
          trustApi.listProviders(),
        ]);

        setPendingDisputes(disputesRes.disputes.filter((item) => item.status !== 'resolved').length);
        setIdQueue(queueRes.count);
        setSuspendedUsers(providersRes.providers.filter((item) => item.user.isSuspended).length);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load admin workspace data');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const adminStats = useMemo(
    () => [
      { label: 'Pending Disputes', value: String(pendingDisputes), loading },
      { label: 'ID Review Queue', value: String(idQueue), loading },
      { label: 'Suspended Providers', value: String(suspendedUsers), loading },
    ],
    [pendingDisputes, idQueue, suspendedUsers, loading]
  );

  const adminFeatures: FeatureCard[] = [
    {
      title: 'Dispute Desk',
      description: 'Review and resolve open conflicts, assign moderators, and close escalated cases.',
      to: '/admin/disputes',
      badge: 'Core',
      stateLabel: loading ? 'Loading' : `${pendingDisputes} active`,
      stateTone: pendingDisputes > 0 ? 'warn' : 'good',
    },
    {
      title: 'ID Review Queue',
      description: 'Approve or reject pending user identity documents from the moderation queue.',
      to: '/admin/id-review-queue',
      badge: 'Moderation',
      stateLabel: loading ? 'Loading' : `${idQueue} pending`,
      stateTone: idQueue > 0 ? 'warn' : 'good',
    },
    {
      title: 'Trust Override',
      description: 'Apply manual trust score overrides for exceptional moderation scenarios.',
      to: '/admin/trust-override',
      badge: 'Moderation',
      stateLabel: 'Manual control',
      stateTone: 'neutral',
    },
    {
      title: 'Suspension Actions',
      description: 'Suspend or unsuspend providers and apply accountable moderation notes.',
      to: '/admin/suspensions',
      badge: 'Moderation',
      stateLabel: loading ? 'Loading' : `${suspendedUsers} suspended`,
      stateTone: suspendedUsers > 0 ? 'danger' : 'good',
    },
    {
      title: 'Admin Profile',
      description: 'Manage administrator profile details and account verification details.',
      to: '/admin/profile',
    },
    {
      title: 'Provider Dataset',
      description: 'Inspect API-backed provider availability and trust posture in real time.',
      to: '/providers/nearby',
      stateLabel: error ? 'Data error' : 'Live',
      stateTone: error ? 'danger' : 'good',
    },
  ];

  return (
    <>
      {error ? <p className="px-6 pt-4 text-sm text-red-300">{error}</p> : null}
      <RoleHub
        roleTitle="Admin"
        subtitle="Control room for platform moderation, safety governance, and operational command."
        accentClass="border-cyan-300/50 bg-cyan-500/10 text-cyan-200"
        stats={adminStats}
        features={adminFeatures}
      />
    </>
  );
}

export default function AdminHome() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminHomeContent />
    </ProtectedRoute>
  );
}
