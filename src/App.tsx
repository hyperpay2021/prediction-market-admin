import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

function App() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <section className="mx-auto flex min-h-svh w-full max-w-5xl flex-col justify-center px-6 py-16">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            React + Vite + TypeScript
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-normal text-balance sm:text-5xl">
              TailwindCSS and shadcn/ui are ready.
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              This starter uses Tailwind CSS v3, PostCSS, shadcn CSS variables,
              path aliases, and a source-owned Button component.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button>
              Primary action
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline">Secondary action</Button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
