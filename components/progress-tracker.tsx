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
} from "lucide-react"

const progressData = [
  {
    month: "January 2024",
    date: "2024-01",
    metrics: {
      twitterFollowers: 1250,
      youtubeSubscribers: 340,
      tiktokFollowers: 890,
      instagramFollowers: 2100,
      newsletterSubscribers: 450,
      totalGMV: 12500,
      productivityGain: 2.1,
    },
    skillsGained: ["Basic Design Principles"],
    milestones: ["Started 10x experiment", "Launched first project"],
  },
  {
    month: "February 2024",
    date: "2024-02",
    metrics: {
      twitterFollowers: 1580,
      youtubeSubscribers: 520,
      tiktokFollowers: 1340,
      instagramFollowers: 2650,
      newsletterSubscribers: 680,
      totalGMV: 18900,
      productivityGain: 3.4,
    },
    skillsGained: ["Figma Basics", "Team Management"],
    milestones: ["Reached 500 YouTube subscribers", "First $15k month"],
  },
  {
    month: "March 2024",
    date: "2024-03",
    metrics: {
      twitterFollowers: 2100,
      youtubeSubscribers: 780,
      tiktokFollowers: 1890,
      instagramFollowers: 3200,
      newsletterSubscribers: 920,
      totalGMV: 25600,
      productivityGain: 4.8,
    },
    skillsGained: ["Advanced Design Systems", "Vibe Coding Fundamentals"],
    milestones: ["2k Twitter followers", "Launched Bannaa.ai"],
  },
  {
    month: "April 2024",
    date: "2024-04",
    metrics: {
      twitterFollowers: 2850,
      youtubeSubscribers: 1100,
      tiktokFollowers: 2450,
      instagramFollowers: 4100,
      newsletterSubscribers: 1250,
      totalGMV: 34200,
      productivityGain: 6.2,
    },
    skillsGained: ["Project Management", "Advanced Vibe Coding"],
    milestones: ["1k YouTube subscribers", "First viral TikTok"],
  },
  {
    month: "May 2024",
    date: "2024-05",
    metrics: {
      twitterFollowers: 3600,
      youtubeSubscribers: 1450,
      tiktokFollowers: 3200,
      instagramFollowers: 5300,
      newsletterSubscribers: 1680,
      totalGMV: 42800,
      productivityGain: 7.9,
    },
    skillsGained: ["UI/UX Design", "Team Leadership"],
    milestones: ["5k Instagram followers", "$40k month"],
  },
  {
    month: "June 2024",
    date: "2024-06",
    metrics: {
      twitterFollowers: 4200,
      youtubeSubscribers: 1850,
      tiktokFollowers: 4100,
      instagramFollowers: 6800,
      newsletterSubscribers: 2100,
      totalGMV: 51500,
      productivityGain: 9.1,
    },
    skillsGained: ["Advanced Management", "Full-Stack Vibe Coding"],
    milestones: ["4k Twitter followers", "2k Newsletter subscribers"],
  },
]

type ProgressTrackerStrings = {
  summary: {
    audience: string
    audienceHint: string
    youtube: string
    youtubeHint: string
    revenue: string
    revenueHint: string
    productivity: string
    productivityHint: string
  }
  timelineEyebrow: string
  timelineTitle: string
  timelineDescription: string
  monthLabel: string
  metrics: {
    twitter: string
    youtube: string
    tiktok: string
    instagram: string
    newsletter: string
    totalGmv: string
    productivity: string
    skills: string
  }
  skillsTitle: string
  milestonesTitle: string
}

function calculateGrowth(current: number, initial: number) {
  if (!initial) return "0.0"
  return (((current - initial) / initial) * 100).toFixed(1)
}

function formatMetricValue(label: string, value: number) {
  if (label === "currency") {
    return `$${value.toLocaleString()}`
  }

  if (label === "productivity") {
    return `${value}x`
  }

  return value.toLocaleString()
}

export function ProgressTracker({ strings }: { strings: ProgressTrackerStrings }) {
  const latestData = progressData[progressData.length - 1]
  const firstData = progressData[0]
  const months = [...progressData].reverse()

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
  ]

  return (
    <div className="space-y-10 md:space-y-14">
      <div className="grid gap-px border border-black/15 bg-black/15 md:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map((card) => {
          const Icon = card.icon

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
          )
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
            const metrics = [
              { label: strings.metrics.twitter, value: monthData.metrics.twitterFollowers, kind: "count", icon: Twitter },
              { label: strings.metrics.youtube, value: monthData.metrics.youtubeSubscribers, kind: "count", icon: Video },
              { label: strings.metrics.tiktok, value: monthData.metrics.tiktokFollowers, kind: "count", icon: Zap },
              { label: strings.metrics.instagram, value: monthData.metrics.instagramFollowers, kind: "count", icon: Instagram },
              { label: strings.metrics.newsletter, value: monthData.metrics.newsletterSubscribers, kind: "count", icon: Mail },
              { label: strings.metrics.totalGmv, value: monthData.metrics.totalGMV, kind: "currency", icon: DollarSign },
              { label: strings.metrics.productivity, value: monthData.metrics.productivityGain, kind: "productivity", icon: TrendingUp },
              { label: strings.metrics.skills, value: monthData.skillsGained.length, kind: "count", icon: ArrowUpRight },
            ]

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
                    {metrics.map((metric) => {
                      const Icon = metric.icon

                      return (
                        <div key={`${monthData.date}-${metric.label}`} className="bg-white px-5 py-5">
                          <div className="flex items-center justify-between">
                            <p className="stitch-mono text-[10px] uppercase tracking-[0.28em] text-black/45">{metric.label}</p>
                            <Icon className="h-4 w-4 text-black/60" />
                          </div>
                          <p className="stitch-display mt-4 text-2xl font-semibold uppercase tracking-[-0.08em] text-black">
                            {formatMetricValue(metric.kind, metric.value)}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="grid gap-8 px-5 py-6 md:px-6 lg:grid-cols-2">
                  <div>
                    <p className="stitch-mono text-[10px] uppercase tracking-[0.32em] text-black/45">
                      {strings.skillsTitle}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {monthData.skillsGained.map((skill) => (
                        <span
                          key={`${monthData.date}-${skill}`}
                          className="stitch-mono inline-flex items-center border border-black/15 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-black"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="stitch-mono text-[10px] uppercase tracking-[0.32em] text-black/45">
                      {strings.milestonesTitle}
                    </p>
                    <ul className="mt-4 space-y-3">
                      {monthData.milestones.map((milestone) => (
                        <li key={`${monthData.date}-${milestone}`} className="flex items-start gap-3 text-sm leading-6 text-black/68">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-black" />
                          <span>{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
