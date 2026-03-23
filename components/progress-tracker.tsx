import {
  ArrowUpRight,
  Calendar,
  DollarSign,
  Instagram,
  Mail,
  TrendingUp,
  Twitter,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import type { GlobalMetric } from "@/types/database";

type ProgressTrackerStrings = {
  summary: {
    audience: string;
    audienceHint: string;
    youtube: string;
    youtubeHint: string;
    revenue: string;
    revenueHint: string;
    productivity: string;
    productivityHint: string;
  };
  timelineEyebrow: string;
  timelineTitle: string;
  timelineDescription: string;
  monthLabel: string;
  metrics: {
    twitter: string;
    youtube: string;
    tiktok: string;
    instagram: string;
    newsletter: string;
    totalGmv: string;
    productivity: string;
    skills: string;
  };
  skillsTitle: string;
  milestonesTitle: string;
};

type ProgressEntry = {
  month: string;
  date: string;
  metrics: {
    twitterFollowers: number;
    youtubeSubscribers: number;
    tiktokFollowers: number;
    instagramFollowers: number;
    newsletterSubscribers: number;
    totalGMV: number;
    productivityGain: number;
  };
  skillsGained: string[];
  milestones: string[];
};

function calculateGrowth(current: number, initial: number) {
  if (!initial) return "0.0";
  return (((current - initial) / initial) * 100).toFixed(1);
}

function toProgressData(metrics: GlobalMetric[]): ProgressEntry[] {
  return [...metrics]
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((metric) => ({
      month: format(parseISO(metric.month), "MMMM yyyy"),
      date: metric.month.slice(0, 7),
      metrics: {
        twitterFollowers: metric.twitter_followers,
        youtubeSubscribers: metric.youtube_subscribers,
        tiktokFollowers: metric.tiktok_followers,
        instagramFollowers: metric.instagram_followers,
        newsletterSubscribers: metric.newsletter_subscribers,
        totalGMV: metric.total_gmv,
        productivityGain: metric.productivity_gain,
      },
      skillsGained: metric.skills_gained,
      milestones: metric.milestones,
    }));
}

export function ProgressTracker({
  metrics,
  strings,
}: {
  metrics: GlobalMetric[];
  strings: ProgressTrackerStrings;
}) {
  const progressData = toProgressData(metrics);
  const latestData = progressData[progressData.length - 1];
  const firstData = progressData[0];
  const months = [...progressData].reverse();

  if (!latestData || !firstData) {
    return null;
  }

  const overviewCards = [
    {
      title: strings.summary.audience,
      value: (
        latestData.metrics.twitterFollowers +
        latestData.metrics.instagramFollowers +
        latestData.metrics.tiktokFollowers
      ).toLocaleString(),
      hint: strings.summary.audienceHint,
      icon: Users,
    },
    {
      title: strings.summary.youtube,
      value: latestData.metrics.youtubeSubscribers.toLocaleString(),
      hint: `${calculateGrowth(latestData.metrics.youtubeSubscribers, firstData.metrics.youtubeSubscribers)}% ${strings.summary.youtubeHint}`,
      icon: Video,
    },
    {
      title: strings.summary.revenue,
      value: `$${latestData.metrics.totalGMV.toLocaleString()}`,
      hint: strings.summary.revenueHint,
      icon: DollarSign,
    },
    {
      title: strings.summary.productivity,
      value: `${latestData.metrics.productivityGain}x`,
      hint: strings.summary.productivityHint,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-10 md:space-y-14">
      <div className="grid gap-px border border-black/15 bg-black/15 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.title} className="bg-white px-5 py-6">
              <div className="flex items-center justify-between">
                <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">{card.title}</p>
                <Icon className="h-4 w-4 text-black/70" />
              </div>
              <p className="stitch-display mt-5 text-4xl font-semibold uppercase tracking-[-0.08em] text-black">
                {card.value}
              </p>
              <p className="mt-3 text-sm text-black/58">{card.hint}</p>
            </div>
          );
        })}
      </div>

      <section>
        <div className="flex flex-col gap-4 border-b border-black/15 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="stitch-mono text-[10px] uppercase tracking-[0.35em] text-black/55">
              {strings.timelineEyebrow}
            </p>
            <h2 className="stitch-display mt-3 text-4xl font-semibold uppercase tracking-[-0.08em] text-black md:text-6xl">
              {strings.timelineTitle}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-black/65 md:text-base">
            {strings.timelineDescription}
          </p>
        </div>

        <div className="mt-8 space-y-8">
          {months.map((monthData, index) => {
            const metricsList = [
              { label: strings.metrics.twitter, value: monthData.metrics.twitterFollowers, kind: "count", icon: Twitter },
              { label: strings.metrics.youtube, value: monthData.metrics.youtubeSubscribers, kind: "count", icon: Video },
              { label: strings.metrics.tiktok, value: monthData.metrics.tiktokFollowers, kind: "count", icon: Zap },
              { label: strings.metrics.instagram, value: monthData.metrics.instagramFollowers, kind: "count", icon: Instagram },
              { label: strings.metrics.newsletter, value: monthData.metrics.newsletterSubscribers, kind: "count", icon: Mail },
              { label: strings.metrics.totalGmv, value: monthData.metrics.totalGMV, kind: "currency", icon: DollarSign },
              { label: strings.metrics.productivity, value: monthData.metrics.productivityGain, kind: "productivity", icon: TrendingUp },
              { label: strings.metrics.skills, value: monthData.skillsGained.length, kind: "count", icon: ArrowUpRight },
            ];

            return (
              <article key={monthData.date} className="border border-black/15 bg-white">
                <div className="grid gap-px border-b border-black/15 bg-black/15 lg:grid-cols-[240px_minmax(0,1fr)]">
                  <div className="bg-[#f7f5f1] px-5 py-6 md:px-6">
                    <p className="stitch-mono text-[10px] uppercase tracking-[0.32em] text-black/45">
                      {strings.monthLabel} {progressData.length - index}
                    </p>
                    <div className="mt-6 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="stitch-display text-3xl font-semibold uppercase leading-none tracking-[-0.08em] text-black">
                          {monthData.month}
                        </h3>
                        <p className="stitch-mono mt-3 text-[10px] uppercase tracking-[0.28em] text-black/45">
                          {monthData.date}
                        </p>
                      </div>
                      <Calendar className="h-5 w-5 text-black/55" />
                    </div>
                  </div>

                  <div className="grid gap-px bg-black/15 md:grid-cols-2 xl:grid-cols-4">
                    {metricsList.map((metric) => {
                      const Icon = metric.icon;
                      const value =
                        metric.kind === "currency"
                          ? `$${metric.value.toLocaleString()}`
                          : metric.kind === "productivity"
                            ? `${metric.value}x`
                            : metric.value.toLocaleString();

                      return (
                        <div key={`${monthData.date}-${metric.label}`} className="bg-white px-5 py-5">
                          <div className="flex items-center justify-between">
                            <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/45">
                              {metric.label}
                            </p>
                            <Icon className="h-4 w-4 text-black/55" />
                          </div>
                          <p className="stitch-display mt-4 text-3xl font-semibold uppercase tracking-[-0.08em] text-black">
                            {value}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-px bg-black/15 lg:grid-cols-2">
                  <div className="bg-white px-5 py-6 md:px-6">
                    <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">
                      {strings.skillsTitle}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {monthData.skillsGained.map((skill) => (
                        <span
                          key={`${monthData.date}-${skill}`}
                          className="stitch-mono border border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-black/70"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#f7f5f1] px-5 py-6 md:px-6">
                    <p className="stitch-mono text-[10px] uppercase tracking-[0.3em] text-black/45">
                      {strings.milestonesTitle}
                    </p>
                    <ul className="mt-4 space-y-3">
                      {monthData.milestones.map((milestone) => (
                        <li key={`${monthData.date}-${milestone}`} className="flex items-start gap-3 text-sm text-black/70">
                          <span className="mt-1 h-2 w-2 bg-black" />
                          <span>{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
