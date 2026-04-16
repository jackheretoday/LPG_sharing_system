import { useEffect, useMemo, useState } from 'react';
import { RoleHub, type FeatureCard } from '@/components/RoleHub';
import { trustApi } from '@/lib/trustApi';
import { AuthenticatedRoute } from '@/components/trust/AuthenticatedRoute';

function ConsumerHomeContent() {
  const [loading, setLoading] = useState(true);
  const [trustScore, setTrustScore] = useState(0);
  const [providerCount, setProviderCount] = useState(0);
  const [openDisputes, setOpenDisputes] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [trustRes, providersRes, disputesRes] = await Promise.all([
          trustApi.getMyTrust(),
          trustApi.listProviders(),
          trustApi.listDisputes(),
        ]);

        setTrustScore(Number(trustRes.trust.trustScore || 0));
        setProviderCount(providersRes.count);
        setOpenDisputes(disputesRes.disputes.filter((item) => item.status !== 'resolved').length);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const consumerStats = useMemo(
    () => [
      { label: 'Trust Score', value: String(trustScore), loading },
      { label: 'Nearby Providers', value: String(providerCount), loading },
      { label: 'Open Disputes', value: String(openDisputes), loading },
    ],
    [trustScore, providerCount, openDisputes, loading]
  );

  const consumerFeatures: FeatureCard[] = [
    {
      title: 'Consumer Dashboard',
      description: 'See your current trust posture and verification status from backend data.',
      to: '/trust/me',
      badge: 'Primary',
      stateLabel: loading ? 'Loading' : `Trust ${trustScore}`,
      stateTone: trustScore >= 70 ? 'good' : 'warn',
    },
    {
      title: 'Nearby Providers',
      description: 'Locate verified providers from the dedicated provider dataset endpoint.',
      to: '/providers/nearby',
      stateLabel: loading ? 'Loading' : `${providerCount} live`,
      stateTone: 'neutral',
    },
    {
      title: 'LPG Prediction & Leakage',
      description: 'Track cylinder empty-date predictions and quickly access leakage-safe planning actions.',
      to: '/lpg-prediction',
      badge: 'LPG',
      stateLabel: 'Live',
      stateTone: 'good',
    },
    {
      title: 'Raise Dispute',
      description: 'Submit new dispute records and keep moderation context synced with backend state.',
      to: '/disputes/new/demo-exchange',
      stateLabel: loading ? 'Loading' : `${openDisputes} active`,
      stateTone: openDisputes > 0 ? 'warn' : 'good',
    },
    {
      title: 'Dispute Timeline',
      description: 'Track dispute progress, updates, and outcomes across all your records.',
      to: '/disputes',
      badge: 'API',
    },
    {
      title: 'Verification Setup',
      description: 'Complete PIN and ID setup to unlock trust badges and higher reliability.',
      to: '/onboarding/setup',
      badge: 'API',
    },
    {
      title: 'Emergency Request',
      description: 'Raise emergency requests with real-time response tracking and alerts.',
      to: '/emergency',
    },
  ];

  return (
    <RoleHub
      roleTitle="Consumer"
      subtitle="Task-focused workspace for provider discovery, verification, and dispute management."
      accentClass="border-amber-300/50 bg-amber-500/10 text-amber-200"
      stats={consumerStats}
      features={consumerFeatures}
    />
  );
}

export default function ConsumerHome() {
  return (
    <AuthenticatedRoute>
      <ConsumerHomeContent />
    </AuthenticatedRoute>
  );
}
