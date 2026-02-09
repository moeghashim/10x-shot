import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Twitter,
  Youtube,
  Instagram,
  Mail,
  DollarSign,
  TrendingUp,
  Zap,
  Calendar,
  Users,
  Video,
  Heart,
  Palette,
  Settings,
  Code,
} from "lucide-react"

// Mock data - in a real app, this would come from your analytics APIs
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

const skillIcons = {
  design: Palette,
  management: Settings,
  "vibe coding": Code,
  "Basic Design Principles": Palette,
  "Figma Basics": Palette,
  "Team Management": Settings,
  "Advanced Design Systems": Palette,
  "Vibe Coding Fundamentals": Code,
  "Project Management": Settings,
  "Advanced Vibe Coding": Code,
  "UI/UX Design": Palette,
  "Team Leadership": Settings,
  "Advanced Management": Settings,
  "Full-Stack Vibe Coding": Code,
}

export function ProgressTracker() {
  const latestData = progressData[progressData.length - 1]
  const firstData = progressData[0]
  const months = [...progressData].reverse()

  const calculateGrowth = (current: number, initial: number) => {
    return (((current - initial) / initial) * 100).toFixed(1)
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-700">Social Media</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {(
                latestData.metrics.twitterFollowers +
                latestData.metrics.instagramFollowers +
                latestData.metrics.tiktokFollowers
              ).toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 mt-1">Total followers across platforms</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-red-700">YouTube</CardTitle>
              <Video className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {latestData.metrics.youtubeSubscribers.toLocaleString()}
            </div>
            <p className="text-xs text-red-600 mt-1">
              +{calculateGrowth(latestData.metrics.youtubeSubscribers, firstData.metrics.youtubeSubscribers)}% growth
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-700">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">${latestData.metrics.totalGMV.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">Total GMV this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-purple-700">Productivity</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{latestData.metrics.productivityGain}x</div>
            <p className="text-xs text-purple-600 mt-1">Current productivity gain</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Progress Timeline */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-black">Monthly Progress</h2>

        {months.map((monthData, index) => (
          <Card key={monthData.date} className="bg-white border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <CardTitle className="text-xl text-black">{monthData.month}</CardTitle>
                </div>
                <Badge variant="outline" className="text-gray-600 border-gray-300">
                  Month {progressData.length - index}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Twitter className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-900">
                      {monthData.metrics.twitterFollowers.toLocaleString()}
                    </div>
                    <div className="text-xs text-blue-600">Twitter</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <Youtube className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="font-semibold text-red-900">
                      {monthData.metrics.youtubeSubscribers.toLocaleString()}
                    </div>
                    <div className="text-xs text-red-600">YouTube</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                  <Heart className="h-5 w-5 text-pink-600" />
                  <div>
                    <div className="font-semibold text-pink-900">
                      {monthData.metrics.tiktokFollowers.toLocaleString()}
                    </div>
                    <div className="text-xs text-pink-600">TikTok</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Instagram className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-semibold text-purple-900">
                      {monthData.metrics.instagramFollowers.toLocaleString()}
                    </div>
                    <div className="text-xs text-purple-600">Instagram</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {monthData.metrics.newsletterSubscribers.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">Newsletter</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-semibold text-green-900">${monthData.metrics.totalGMV.toLocaleString()}</div>
                    <div className="text-xs text-green-600">Total GMV</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="font-semibold text-orange-900">{monthData.metrics.productivityGain}x</div>
                    <div className="text-xs text-orange-600">Productivity</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                  <Zap className="h-5 w-5 text-indigo-600" />
                  <div>
                    <div className="font-semibold text-indigo-900">{monthData.skillsGained.length}</div>
                    <div className="text-xs text-indigo-600">Skills Gained</div>
                  </div>
                </div>
              </div>

              {/* Skills Gained */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Skills Gained This Month
                </h4>
                <div className="flex flex-wrap gap-2">
                  {monthData.skillsGained.map((skill, skillIndex) => {
                    const IconComponent = skillIcons[skill as keyof typeof skillIcons] || Code
                    return (
                      <Badge
                        key={skillIndex}
                        variant="outline"
                        className="flex items-center gap-1 text-gray-700 border-gray-300"
                      >
                        <IconComponent className="h-3 w-3" />
                        {skill}
                      </Badge>
                    )
                  })}
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Key Milestones
                </h4>
                <ul className="space-y-1">
                  {monthData.milestones.map((milestone, milestoneIndex) => (
                    <li key={milestoneIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      {milestone}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
