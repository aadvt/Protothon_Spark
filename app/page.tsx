import Link from 'next/link'
import { Briefcase, Users, BarChart3, ArrowRight, ShieldCheck, Sparkles, Code2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="gradient-background" />
      <div className="glow-orb-1" />
      <div className="glow-orb-2" />

      <Header />

      <main className="relative mx-auto max-w-7xl px-6 pt-32 pb-24 lg:pt-48">

        {/* Hero Section */}
        <div className="mb-32 text-center max-w-4xl mx-auto z-10 relative fade-in-up">
          <div className="mb-8 flex justify-center fade-in-up delay-100">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              <span>Next-Gen Placement Platform</span>
            </div>
          </div>

          <h1 className="mb-8 text-6xl font-extrabold tracking-tight text-balance sm:text-7xl fade-in-up delay-200">
            Automate College Placements with <span className="gradient-text">Proven Intelligence</span>
          </h1>

          <p className="mb-12 text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed fade-in-up delay-300">
            Move beyond self-proclaimed skills. PlacementHub connects verified students with top recruiters using AI-driven code analysis and strict governance policies.
          </p>

          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row fade-in-up delay-400">
            <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
              <Link href="/login" className="flex items-center gap-2">
                Start Hiring <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full backdrop-blur-md bg-white/5 border-white/10 dark:hover:bg-white/10">
              <Link href="/login">Student Portal</Link>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid gap-6 md:grid-cols-4 mb-40 fade-in-up delay-400">
          {[
            { label: "Verified Students", value: "1000+", icon: Users },
            { label: "Active Jobs", value: "500+", icon: Briefcase },
            { label: "AI Analysis", value: "Real-time", icon: Sparkles },
            { label: "Placement Rate", value: "95%", icon: BarChart3 }
          ].map((stat, i) => (
            <div key={i} className="glass p-8 text-center flex flex-col items-center justify-center">
              <stat.icon className="h-8 w-8 text-primary/50 mb-4" />
              <p className="mb-2 text-4xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Feature Highlights Grid */}
        <div id="features" className="mb-32 relative z-10">
          <div className="text-center mb-20 fade-in-up">
            <h2 className="text-4xl font-bold mb-4">A complete ecosystem</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Built specifically for the intersection of ambitious students, demanding recruiters, and rigorous administrators.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Student Card */}
            <div className="bento-card fade-in-up delay-100 group">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 shadow-inner border border-cyan-500/20 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">
                <Code2 className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">For Students</h3>
              <p className="mb-8 text-muted-foreground leading-relaxed">
                Connect your GitHub to have Gemini 3 Pro instantly analyze your code and generate a verified, live Skill Radar. Prove your worth with Code, not just keywords.
              </p>
              <Button asChild variant="ghost" className="w-full justify-between hover:bg-cyan-500/10 hover:text-cyan-500">
                <Link href="/login">
                  Showcase Skills <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Recruiter Card */}
            <div className="bento-card fade-in-up delay-200 group">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 shadow-inner border border-indigo-500/20 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">For Recruiters</h3>
              <p className="mb-8 text-muted-foreground leading-relaxed">
                Define strict 'Hard Policies' for CGPA and let the Weighted Match Engine highlight the top 20 verified candidates. Schedule interviews with one click.
              </p>
              <Button asChild variant="ghost" className="w-full justify-between hover:bg-indigo-500/10 hover:text-indigo-500">
                <Link href="/login">
                  Find Talent <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Admin Card */}
            <div className="bento-card fade-in-up delay-300 group">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 dark:text-rose-400 shadow-inner border border-rose-500/20 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all duration-300">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-2xl font-bold">For Governance</h3>
              <p className="mb-8 text-muted-foreground leading-relaxed">
                Maintain a tamper-proof Placement Audit Trail. Execute manual overrides for exceptional edge-cases while keeping total transparency.
              </p>
              <Button asChild variant="ghost" className="w-full justify-between hover:bg-rose-500/10 hover:text-rose-500">
                <Link href="/login">
                  Manage Policies <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
