import { Mail } from "lucide-react"

export function NewsletterSection() {
  return (
    <section className="px-6 py-16 bg-gray-50">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600">
            <Mail className="h-4 w-4" />
            Stay Updated
          </div>
        </div>

        <h2 className="mb-4 text-3xl font-bold text-black">Get the Latest Updates</h2>

        <p className="mb-8 text-lg text-gray-600 max-w-2xl mx-auto">
          Follow along as I document the real impact of AI on productivity. Get insights, lessons learned, and
          behind-the-scenes updates from each project.
        </p>

        <div className="flex justify-center mb-6">
          <iframe 
            src="https://buildinpublic.substack.com/embed" 
            width="480" 
            height="320" 
            style={{ border: "1px solid #EEE", background: "white", overflow: "hidden" }} 
            title="Subscribe to Building in Public Newsletter"
          />
        </div>

        <p className="mt-4 text-xs text-gray-500">No spam, unsubscribe at any time. Updates sent weekly.</p>
      </div>
    </section>
  )
}
