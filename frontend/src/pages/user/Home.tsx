import { useEffect, useMemo, useState } from 'react';
import { RoleHub, type FeatureCard } from '@/components/RoleHub';
import { trustApi } from '@/lib/trustApi';
import { AuthenticatedRoute } from '@/components/trust/AuthenticatedRoute';

function UserHomeContent() {
  const [loading, setLoading] = useState(true);
  const [trustScore, setTrustScore] = useState(0);
  const [openDisputes, setOpenDisputes] = useState(0);
  const [providerCount, setProviderCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [trustRes, disputesRes, providersRes] = await Promise.all([
          trustApi.getMyTrust(),
          trustApi.listDisputes(),
          trustApi.listProviders(),
        ]);

        setTrustScore(Number(trustRes.trust.trustScore || 0));
        setOpenDisputes(disputesRes.disputes.filter((item) => item.status !== 'resolved').length);
        setProviderCount(providersRes.count);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const userStats = useMemo(
    () => [
      { label: 'Trust Score', value: String(trustScore), loading },
      { label: 'Open Disputes', value: String(openDisputes), loading },
      { label: 'Nearby Providers', value: String(providerCount), loading },
    ],
    [trustScore, openDisputes, providerCount, loading]
  );

  const userFeatures: FeatureCard[] = [
    {
      title: 'Profile Center',
      description: 'Update your identity details, preferences, and personal account settings.',
      to: '/trust/me',
      badge: 'Personal',
      stateLabel: loading ? 'Loading' : `Trust ${trustScore}`,
      stateTone: trustScore >= 70 ? 'good' : 'warn',
    },
    {
      title: 'Find Providers',
      description: 'Search nearby available providers from the live provider dataset.',
      to: '/providers/nearby',
      stateLabel: loading ? 'Loading' : `${providerCount} live`,
      stateTone: 'neutral',
    },
    {
      title: 'LPG Prediction & Leakage',
      description: 'Open the LPG module to monitor predicted empty dates and leakage-aware response flow.',
      to: '/lpg-prediction',
      badge: 'LPG',
      stateLabel: 'Live',
      stateTone: 'good',
    },
    {
      title: 'Raise Dispute',
      description: 'Create and track service disputes against exchanges directly from workflow pages.',
      to: '/disputes/new/demo-exchange',
      stateLabel: loading ? 'Loading' : `${openDisputes} active`,
      stateTone: openDisputes > 0 ? 'warn' : 'good',
    },
    {
      title: 'Dispute Tracker',
      description: 'Review all your disputes and monitor their status changes in real time.',
      to: '/disputes',
      badge: 'API',
    },
    {
      title: 'Verification Setup',
      description: 'Complete address and ID verification to increase trust reliability.',
      to: '/onboarding/setup',
      badge: 'API',
    },
    {
      title: 'Emergency Access',
      description: 'Trigger emergency assistance and monitor response updates immediately.',
      to: '/emergency',
    },
  ];

  return (
    <RoleHub
      roleTitle="User"
      subtitle="Personal workspace for trust profile, provider discovery, and dispute lifecycle management."
      accentClass="border-emerald-300/50 bg-emerald-500/10 text-emerald-200"
      stats={userStats}
      features={userFeatures}
    />
  );
}

export default function UserHome() {
  return (
    <AuthenticatedRoute>
      <UserHomeContent />
    </AuthenticatedRoute>
  );
}
