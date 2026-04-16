import { Link } from 'react-router-dom';

export type FeatureCard = {
  title: string;
  description: string;
  to: string;
  badge?: string;
  stateLabel?: string;
  stateTone?: "neutral" | "good" | "warn" | "danger";
};

type RoleHubProps = {
  roleTitle: string;
  subtitle: string;
  accentClass: string;
  stats: Array<{ label: string; value: string; loading?: boolean }>;
  features: FeatureCard[];
};

const stateToneClass = {
  neutral: "border-white/20 bg-white/10 text-white/80",
  good: "border-emerald-300/30 bg-emerald-400/15 text-emerald-200",
  warn: "border-amber-300/30 bg-amber-400/15 text-amber-200",
  danger: "border-red-300/30 bg-red-400/15 text-red-200",
};

export function RoleHub({ roleTitle, subtitle, accentClass, stats, features }: RoleHubProps) {
  return (
    <div className="relative min-h-screen bg-[#070b13] text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.16),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.14),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(99,102,241,0.14),transparent_40%)]" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8 md:px-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="text-sm font-semibold tracking-[0.24em] text-white/70 hover:text-white transition-colors">
            VEX CONTROL
          </Link>
          <Link
            to="/auth"
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            Switch Account
          </Link>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:p-8">
          <p className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${accentClass}`}>
            {roleTitle}
          </p>
          <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Operations Workspace</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70 md:text-base">{subtitle}</p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.16em] text-white/50">{stat.label}</p>
                <p className="mt-2 text-2xl font-black tracking-tight">{stat.loading ? "..." : stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.to}
              className="group rounded-2xl border border-white/10 bg-black/35 p-5 transition-all hover:-translate-y-1 hover:border-white/30 hover:bg-black/45"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-black tracking-tight">{feature.title}</h2>
                {feature.badge || feature.stateLabel ? (
                  <div className="flex flex-col items-end gap-2">
                    {feature.badge ? (
                  <span className="rounded-full border border-white/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/70">
                    {feature.badge}
                  </span>
                    ) : null}
                    {feature.stateLabel ? (
                      <span
                        className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${stateToneClass[feature.stateTone || "neutral"]}`}
                      >
                        {feature.stateLabel}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-white/70">{feature.description}</p>
              <p className="mt-5 text-sm font-semibold text-cyan-300 transition-colors group-hover:text-cyan-200">Open module -&gt;</p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
