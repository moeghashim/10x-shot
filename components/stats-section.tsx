import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function StatsSection() {
  const stats = [
    { label: "Projects Launched", value: 7, max: 10 },
    { label: "Avg Productivity Gain", value: 650, max: 1000, suffix: "%" },
    { label: "AI Tools Integrated", value: 23, max: 50 },
    { label: "Time Saved (Hours)", value: 340, max: 500 },
  ]

  return (
    <section className="px-6 py-16 bg-gray-50">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-black">Current Impact Metrics</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="mb-2 text-2xl font-bold text-black">
                  {stat.value}
                  {stat.suffix || ""}
                  <span className="text-sm text-gray-500">/{stat.max}</span>
                </div>
                <div className="mb-3 text-sm text-gray-600">{stat.label}</div>
                <Progress value={(stat.value / stat.max) * 100} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
