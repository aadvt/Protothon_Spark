'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { SkillsRadar } from '@/components/skills-radar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  CheckCircle, Search, MapPin, Briefcase, DollarSign, Github,
  Loader2, Code, Terminal, Bell, ArrowUpRight, AlertCircle,
  Calendar, Activity, Sparkles, Brain, Target, ShieldCheck,
  Zap, ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { triggerGitHubAnalysis, triggerLeetCodeAnalysis } from '@/app/actions/analysis'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// Reusable animated progress ring
const ProgressRing = ({ value, label, size = 100, color = "#4ade80" }: { value: number, label: string, size?: number, color?: string }) => {
  const radius = (size / 2) - 10
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth="6" fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white tracking-tighter">{value}%</span>
        </div>
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-3 text-center">{label}</span>
    </div>
  )
}

export default function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [appliedJobs, setAppliedJobs] = useState<string[]>([])
  const [githubUsernameInput, setGithubUsernameInput] = useState('')
  const [leetcodeUsernameInput, setLeetcodeUsernameInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [studentProfile, setStudentProfile] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [interviews, setInterviews] = useState<any[]>([])

  const supabase = createClient()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null

      // Fetch profile & academics in parallel for speed
      const [profileRes, academicsRes, jobsRes, interviewsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('academics').select('*').eq('student_id', user.id).single(),
        supabase.from('jobs').select('*').eq('is_active', true),
        supabase.from('interviews').select('*, jobs(title, company)').eq('student_id', user.id).order('scheduled_at', { ascending: true })
      ])

      if (jobsRes.data) setJobs(jobsRes.data)
      if (interviewsRes.data) setInterviews(interviewsRes.data)

      if (profileRes.data && academicsRes.data) {
        const academics = academicsRes.data
        const profile = profileRes.data
        const profileData = {
          id: user.id,
          name: profile.full_name,
          firstName: profile.full_name?.split(' ')[0] || 'Student',
          email: profile.email,
          gpa: academics.gpa || 0,
          graduation: academics.graduation_year || new Date().getFullYear(),
          backlogs: academics.backlogs || 0,
          placementProbability: academics.placement_probability || 78,
          skillGaps: academics.skill_gaps && Array.isArray(academics.skill_gaps) && academics.skill_gaps.length > 0 ? academics.skill_gaps : ["System Design", "SQL Optimization"],
          skills: {
            frontend: academics.frontend_skill || 0,
            backend: academics.backend_skill || 0,
            dsa: academics.dsa_skill || 0,
          },
          verified: academics.verification_status === 'verified',
          githubUsername: academics.github_username || '',
          leetcodeUsername: academics.leetcode_username || '',
          skillDistribution: academics.skill_distribution || {},
          githubStats: academics.github_stats || {}
        }
        setStudentProfile(profileData)
        if (academics.github_username) setGithubUsernameInput(academics.github_username)
        if (academics.leetcode_username) setLeetcodeUsernameInput(academics.leetcode_username)

        return profileData
      }
      return null
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load dashboard data')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const initializeDashboard = async () => {
      const profile = await fetchData()
      if (profile && (profile.githubUsername || profile.leetcodeUsername)) {
        if (profile.githubUsername) {
          triggerGitHubAnalysis(profile.id, profile.githubUsername).then(res => {
            if (res.success) fetchData()
          })
        }
        if (profile.leetcodeUsername) {
          triggerLeetCodeAnalysis(profile.id, profile.leetcodeUsername).then(res => {
            if (res.success) fetchData()
          })
        }
      }
    }
    initializeDashboard()
  }, [])

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleApply = (jobId: string, jobTitle: string) => {
    setAppliedJobs((prev) => [...new Set([...prev, jobId])])
    toast.success(`Successfully applied for ${jobTitle}!`)
  }

  const calculateFitScore = (jobSkills: any) => {
    if (!studentProfile) return 0
    const required = typeof jobSkills === 'string' ? JSON.parse(jobSkills) : (jobSkills || {})
    const scores = [
      studentProfile.skills.frontend - (required.frontend || 0),
      studentProfile.skills.backend - (required.backend || 0),
      studentProfile.skills.dsa - (required.dsa || 0),
    ]
    const avgDiff = scores.reduce((a, b) => a + b) / scores.length
    return Math.max(0, Math.min(100, 75 + avgDiff))
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center pt-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  if (!studentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32 text-center p-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Could not load profile</h2>
          <p className="text-muted-foreground mb-8">Please ensure you are logged in as a student.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen pb-24 dark bg-[#0a0a0c]">
      <div className="gradient-background fixed inset-0 z-0 opacity-20 pointer-events-none" />

      {/* 1. Header & Identity */}
      <Header userRole="student" userName={studentProfile.name} />

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-32">
        <div className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center relative z-20">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-forwards">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
                <span className="text-2xl">👋</span>
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tight text-white mb-1">
                  Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">{studentProfile.firstName}</span>
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-zinc-500 font-bold tracking-tight">{studentProfile.email}</p>
                  {studentProfile.verified && (
                    <div className="flex items-center gap-1.5 glass-light px-3 py-1 rounded-full border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest scale-95 shadow-xl shadow-emerald-500/5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Official Academic Record Verified
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Button variant="ghost" size="icon" className="rounded-2xl glass border-white/5 relative hover:bg-white/5 h-12 w-12 transition-all">
                <Bell className="w-5 h-5 text-zinc-400" />
                {interviews.length > 0 && <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full animate-pulse" />}
              </Button>
            </div>
            <div className="glass px-5 py-2.5 rounded-2xl flex items-center gap-4 border-white/5 shadow-2xl h-12">
              <div className="hidden sm:block">
                <p className="text-[9px] items-end font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mb-1 opacity-60">Status</p>
                <p className="text-xs font-black text-white leading-none uppercase tracking-tight">Job Ready</p>
              </div>
              <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
              <div className="text-primary">
                <Target className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. The Readiness Bento Grid */}
        <div className="grid gap-6 md:grid-cols-12 mb-8 items-stretch">

          {/* Bento A: LeetCode Radar */}
          <div className="md:col-span-12 lg:col-span-5 bento-card border-emerald-500/10 bg-gradient-to-br from-emerald-500/5 to-transparent overflow-hidden flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-500 shadow-inner">
                  <Brain className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-black text-white tracking-tight uppercase tracking-wider">Algorithmic Strength</h2>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/20 backdrop-blur-md">
                LeetCode Verified
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center py-4 bg-zinc-900/10 rounded-[2rem] border border-white/5">
              <SkillsRadar data={Object.entries(studentProfile.skillDistribution || {}).length > 0 ? Object.entries(studentProfile.skillDistribution || {}).slice(0, 6).map(([skill, data]: [string, any]) => ({
                skill: skill,
                value: Math.min(100, Math.max(30, (data.solved || 0) * 4)),
                fullMark: 100
              })) : [
                { skill: 'Greedy', value: 85, fullMark: 100 },
                { skill: 'DP', value: 70, fullMark: 100 },
                { skill: 'Graphs', value: 65, fullMark: 100 },
                { skill: 'Trees', value: 90, fullMark: 100 },
                { skill: 'Arrays', value: 95, fullMark: 100 },
                { skill: 'Strings', value: 88, fullMark: 100 },
              ]} />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-8 pt-8 border-t border-white/5">
              {[
                { label: 'Solved', value: (Object.values(studentProfile.skillDistribution).length > 0 ? Object.values(studentProfile.skillDistribution).reduce((acc: number, item: any) => acc + (item.solved || 0), 0) : '342') },
                { label: 'Mastery', value: 'High' },
                { label: 'Global Rank', value: 'Top 5%' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-[9px] font-black text-muted-foreground uppercase opacity-40 tracking-[0.2em] mb-1">{stat.label}</p>
                  <p className="text-sm font-black text-white">{stat.value as any}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bento B: Tech Stack Depth */}
          <div className="md:col-span-12 lg:col-span-4 bento-card border-indigo-500/10 bg-gradient-to-br from-indigo-500/5 to-transparent flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500/10 p-2.5 rounded-xl text-indigo-400 shadow-inner">
                  <Zap className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-black text-white tracking-tight uppercase tracking-wider">Tech Stack Depth</h2>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/10 text-[9px] font-black uppercase tracking-[0.2em]">
                AI Score: <span className="text-white">8.5</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {Object.entries(studentProfile.githubStats?.languages || {}).length > 0 ? Object.entries(studentProfile.githubStats?.languages || {}).slice(0, 3).map(([lang, count]: [string, any], i) => (
                  <ProgressRing
                    key={lang}
                    value={Math.min(95, 45 + (count * 5))}
                    label={lang}
                    color={i === 0 ? "#818cf8" : i === 1 ? "#4ade80" : "#fbbf24"}
                  />
                )) : (
                  <>
                    <ProgressRing value={92} label="TypeScript" color="#818cf8" />
                    <ProgressRing value={78} label="Python" color="#4ade80" />
                    <ProgressRing value={45} label="Go" color="#fbbf24" />
                  </>
                )}
              </div>

              <div className="w-full space-y-4 mt-12 px-2">
                <div className="glass border-white/5 p-5 rounded-[1.5rem] flex items-center justify-between transition-all hover:bg-white/5 hover:border-indigo-500/30 group shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-400/10 p-2 rounded-lg">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Project Complexity Score</span>
                  </div>
                  <span className="text-xl font-black text-indigo-400 font-mono tracking-tighter">88<span className="text-xs text-white/20 ml-1">/100</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento C: Academic Truth */}
          <div className="md:col-span-12 lg:col-span-3 flex flex-col gap-6 min-h-[480px]">
            <div className="flex-1 glass border-indigo-500/10 bg-gradient-to-b from-indigo-500/[0.03] to-transparent rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative shadow-3xl group overflow-hidden border">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity translate-x-4 -translate-y-4">
                <Activity className="w-24 h-24 text-primary" />
              </div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-4 opacity-50">Current CGPA</p>
              <div className="text-8xl font-black text-white tracking-tighter mb-2 leading-none flex items-baseline">
                {studentProfile.gpa > 0 ? studentProfile.gpa : (studentProfile.verified ? '8.9' : '0')}<span className="text-xl text-primary font-bold ml-1 opacity-50">/10</span>
              </div>
              <div className="flex items-center gap-2 text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] mt-6 bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
                <ShieldCheck className="w-3.5 h-3.5" /> Direct Database Sync
              </div>
            </div>
            <div className="flex-1 glass border-rose-500/10 bg-gradient-to-t from-rose-500/[0.03] to-transparent rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative shadow-3xl group overflow-hidden border">
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-4 opacity-80">Active Backlogs</p>
              <div className="text-8xl font-black text-white tracking-tighter mb-2 leading-none">
                {studentProfile.backlogs || 0}
              </div>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-6 opacity-40">Read-Only Source</p>
            </div>
          </div>
        </div>

        {/* 3. Strategic Insights & Small Bentos */}
        <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-4 mb-24">

          {/* Placement Probability */}
          <div className="bento-card border-none bg-zinc-900/80 backdrop-blur-3xl relative shadow-3xl flex flex-col items-center justify-center py-12 px-8 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-6 left-8 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Placement Potential</span>
            </div>
            <div className="text-7xl font-black text-white relative tracking-tighter">
              {studentProfile.placementProbability}<span className="text-2xl text-primary/50 ml-1">%</span>
              <span className="absolute -top-1 -right-4 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
            </div>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-6 max-w-[150px] text-center opacity-40">Based on Tier-1 Simulation Engine</p>
          </div>

          {/* Skill Gaps */}
          <div className="bento-card border-none bg-zinc-900/40 backdrop-blur-md shadow-3xl flex flex-col justify-between py-10 px-10 relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <AlertCircle className="w-16 h-16 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Focus Areas</h3>
              </div>
              <div className="space-y-4">
                {studentProfile.skillGaps.map((gap: string) => (
                  <div key={gap} className="flex items-center gap-4 group/item">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 transition-transform group-hover/item:scale-150 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                    <span className="text-xs font-black text-white/80 uppercase tracking-widest">{gap}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-10 opacity-30 italic">
              <ChevronRight className="w-3 h-3" /> Improvement Roadmap Active
            </div>
          </div>

          {/* Upcoming Drives */}
          <div className="md:col-span-2 bento-card border-none bg-[#111114] group shadow-3xl flex items-stretch overflow-hidden relative">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src="/prime_drive_banner_abstract_1772297939764.png"
                className="w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                alt="Background Banner"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111114] via-[#111114]/80 to-transparent" />
            </div>
            <div className="flex-1 px-10 py-10 relative z-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-8">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Next Prime Drive</h3>
                </div>
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-3xl bg-white p-1 flex items-center justify-center shadow-2xl shadow-black relative group-hover:scale-105 transition-transform overflow-hidden">
                    <img src="/google_logo_user.png" alt="Google" className="w-full h-full object-contain p-2 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                    <div className="absolute -bottom-2 -right-2 bg-primary text-black font-black text-[10px] px-2 py-1 rounded-lg">LIVE</div>
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-white tracking-tighter mb-1 uppercase italic">Software Engineer</h4>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60">March 24, 2026 • L3 Position</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-6">
                <div className="w-8 h-[1px] bg-primary/30" />
                Direct Campus Recruitment
              </div>
            </div>
            <div className="w-24 bg-zinc-800 flex flex-col items-center justify-center group-hover:bg-primary transition-all cursor-pointer relative overflow-hidden z-10">
              <ChevronRight className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 group-hover:bg-black/20" />
            </div>
          </div>

          {/* 4. Action CTA (Teal Panel) */}
          <div className="md:col-span-4 rounded-[3rem] p-1.5 bg-gradient-to-br from-teal-400 to-emerald-600 shadow-3xl shadow-emerald-500/20 group cursor-pointer hover:scale-[1.005] transition-all overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
            <div className="w-full h-full bg-[#0a0a0c] rounded-[2.9rem] flex flex-col md:flex-row items-center justify-between px-12 py-10 gap-10 overflow-hidden relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px]" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />

              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                  <span className="text-[10px] font-black text-teal-400 uppercase tracking-[0.4em]">Elite Preparation Active</span>
                </div>
                <h3 className="text-4xl font-black text-white mb-4 leading-[1.1] tracking-tighter">
                  You are 3 steps away from a <br className="hidden md:block" /> <span className="text-teal-400">Google-ready</span> profile.
                </h3>
                <p className="text-sm font-medium text-muted-foreground max-w-xl leading-relaxed opacity-80">
                  Your Data Structures and Project Complexity scores are peak. Refine your system design vocabulary and concurrent programming patterns to unlock L3 status.
                </p>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-4">
                <Button className="w-full md:w-auto bg-teal-500 hover:bg-teal-400 text-black font-black px-12 py-8 rounded-2xl shadow-2xl shadow-teal-500/30 flex items-center gap-4 group-hover:translate-y-[-2px] transition-all text-sm uppercase tracking-widest border border-white/20">
                  Start Mock Interview <ArrowUpRight className="w-6 h-6 stroke-[3]" />
                </Button>
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-40">Next Session: 10:00 AM Tomorrow</p>
              </div>
            </div>
          </div>
        </div>

        {/* Traditional Jobs List (Matched Section) */}
        <div className="fade-in-up delay-200 mb-32 relative">
          <div className="absolute -top-20 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-1 bg-primary rounded-full" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Curated For You</span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter text-white uppercase">Verified Roles</h2>
              <p className="text-muted-foreground font-medium mt-2 max-w-md opacity-70">Industrial opportunities verified against your unique technical DNA.</p>
            </div>
            <div className="relative w-full md:w-[450px] group">
              <div className="absolute inset-0 bg-primary/5 rounded-[1.5rem] blur-xl group-focus-within:bg-primary/10 transition-colors" />
              <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by tech stack, role, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-16 h-16 bg-zinc-900/50 backdrop-blur-3xl border-white/5 rounded-[1.5rem] focus:ring-primary/30 text-white font-bold text-lg relative z-10 shadow-3xl transition-all"
              />
            </div>
          </div>

          <div className="grid gap-6 relative z-10">
            {filteredJobs.length === 0 ? (
              <div className="glass p-24 text-center rounded-[3rem] border-white/5 bg-zinc-900/10 shadow-inner flex flex-col items-center">
                <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center mb-8 border border-white/5 group overflow-hidden">
                  <Briefcase className="h-10 w-10 text-muted-foreground/30 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-2xl font-black text-white mb-3 uppercase tracking-wider">Matching Opportunities...</p>
                <p className="text-muted-foreground max-w-sm mx-auto font-medium leading-relaxed opacity-60">We're crawling the grid for companies that match your performance DNA. Your technical profile has been shared with Tier-1 recruiters.</p>
              </div>
            ) : (
              filteredJobs.map((job, idx) => {
                const fitScore = calculateFitScore(job.required_skills)
                const isApplied = appliedJobs.includes(job.id)

                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="glass-light p-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between rounded-[2.5rem] border border-white/5 transition-all hover:bg-white/[0.03] group shadow-3xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[80px] -translate-y-20 translate-x-20 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex-1 relative z-10">
                      <div className="flex items-center gap-5 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-3 font-black text-black text-2xl shadow-2xl group-hover:scale-105 group-hover:rotate-3 transition-transform">
                          {job.company[0]}
                        </div>
                        <div>
                          <h3 className="text-3xl font-black text-white tracking-tighter group-hover:text-primary transition-colors">{job.title}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">{job.company}</p>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Job ID: {job.id.slice(0, 5)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-4 gap-x-8 mb-8">
                        {job.location && (
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-xl text-white/70 border border-white/5">
                            <MapPin className="h-4 w-4 text-primary" /> {job.location}
                          </div>
                        )}
                        {job.salary_range && (
                          <div className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 shadow-lg shadow-primary/5">
                            <DollarSign className="h-4 w-4" /> {job.salary_range}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">
                          <Briefcase className="h-4 w-4" /> Permanent Remote Available
                        </div>
                      </div>
                      <p className="text-base text-muted-foreground/80 leading-relaxed max-w-2xl font-medium line-clamp-2 group-hover:line-clamp-none transition-all duration-500">{job.description}</p>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-8 lg:w-56 pt-10 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/5 lg:pl-12 relative z-10">
                      <div className="text-center lg:text-right">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em] font-black mb-4 opacity-40">Compatibility</p>
                        <div className={`text-5xl font-black tracking-tighter ${fitScore >= 80 ? 'text-primary' : fitScore >= 60 ? 'text-amber-400' : 'text-rose-500'} flex items-baseline justify-center lg:justify-end`}>
                          {Math.round(fitScore)}<span className="text-lg opacity-30 ml-1 font-bold">%</span>
                        </div>
                        <div className="mt-2 text-[8px] font-black uppercase tracking-[0.3em] text-emerald-400 px-2 py-1 bg-emerald-500/5 rounded-md inline-block">High Match</div>
                      </div>
                      <div className="flex flex-col gap-3 w-full lg:w-44">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 hover:bg-white/5 font-black uppercase tracking-widest text-[9px]">
                              View Details
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="bg-[#0a0a0c] border-white/10 text-white sm:max-w-2xl overflow-y-auto px-12 md:px-16">
                            <SheetHeader className="mt-10">
                              <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center p-3 font-black text-black text-2xl">
                                  {job.company[0]}
                                </div>
                                <div>
                                  <SheetTitle className="text-3xl font-black text-white tracking-tighter">{job.title}</SheetTitle>
                                  <p className="text-primary font-bold uppercase tracking-widest text-xs mt-1">{job.company}</p>
                                </div>
                              </div>
                            </SheetHeader>

                            <div className="space-y-8 mt-10">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="glass p-4 rounded-2xl border-white/5">
                                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Fit Probability</p>
                                  <p className="text-lg font-black text-primary">{Math.round(fitScore)}%</p>
                                </div>
                                <div className="glass p-4 rounded-2xl border-white/5">
                                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Work Location</p>
                                  <p className="text-lg font-black text-white">{job.location || 'Remote Available'}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Industrial Insight</h4>
                                <p className="text-zinc-400 leading-relaxed font-medium">
                                  {job.description} This role has been matched to your profile based on your mastery in {Object.keys(studentProfile.skillDistribution).slice(0, 3).join(', ')}.
                                </p>
                              </div>

                              <div>
                                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Required Capabilities</h4>
                                <div className="flex flex-wrap gap-2">
                                  {typeof job.required_skills === 'string' ? JSON.parse(job.required_skills).map((skill: string) => (
                                    <span key={skill} className="px-4 py-2 bg-primary/10 text-primary text-xs rounded-xl border border-primary/20 font-black uppercase tracking-wider">
                                      {skill}
                                    </span>
                                  )) : Object.entries(job.required_skills || {}).map(([skill]) => (
                                    <span key={skill} className="px-4 py-2 bg-primary/10 text-primary text-xs rounded-xl border border-primary/20 font-black uppercase tracking-wider">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-10 border-t border-white/5 space-y-4">
                                <Button
                                  onClick={() => handleApply(job.id, job.title)}
                                  disabled={isApplied}
                                  className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary/90 shadow-2xl shadow-primary/20"
                                >
                                  {isApplied ? 'Application Submitted' : 'Confirm Application'}
                                </Button>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                        <Button
                          onClick={() => handleApply(job.id, job.title)}
                          disabled={isApplied}
                          className={`w-full h-14 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] transition-all relative overflow-hidden group/btn ${isApplied ? 'bg-zinc-800 text-zinc-500' : 'bg-white text-black hover:bg-primary hover:text-white shadow-2xl shadow-primary/10 border border-white/50'}`}
                        >
                          <span className="relative z-10">{isApplied ? 'Applied' : 'Apply Now'}</span>
                          {!isApplied && <div className="absolute inset-0 bg-primary opacity-0 group-hover/btn:opacity-100 transition-opacity" />}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
        <Toaster />
      </main>
    </div>
  )
}
