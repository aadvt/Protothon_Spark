'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Search, Calendar, Briefcase, Filter } from 'lucide-react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { scheduleInterviewAction } from '@/app/actions/notifications'

// Mock candidates data
const mockCandidates = [
  {
    id: '1',
    name: 'Aarav Patel',
    email: 'aarav.patel@college.edu',
    gpa: 8.8,
    frontend: 82,
    backend: 78,
    dsa: 85,
    experience: 0,
    verified: true,
    manualOverride: false,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@college.edu',
    gpa: 9.1,
    frontend: 88,
    backend: 82,
    dsa: 87,
    experience: 0,
    verified: true,
    manualOverride: false,
  },
  {
    id: '3',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@college.edu',
    gpa: 7.6,
    frontend: 75,
    backend: 85,
    dsa: 82,
    experience: 0,
    verified: true,
    manualOverride: false, // Revoked by default to show filter in action
  },
  {
    id: '4',
    name: 'Sneha Singh',
    email: 'sneha.singh@college.edu',
    gpa: 8.2,
    frontend: 85,
    backend: 80,
    dsa: 88,
    experience: 1,
    verified: true,
    manualOverride: false,
  },
  {
    id: '5',
    name: 'Vikram Iyer',
    email: 'vikram.iyer@college.edu',
    gpa: 7.2,
    frontend: 72,
    backend: 78,
    dsa: 80,
    experience: 0,
    verified: false,
    manualOverride: false,
  },
]

// Required skills for the recruiter's job posting
const jobRequirements = {
  frontend: 75,
  backend: 70,
  dsa: 75,
  min_cgpa: 8.0,
}

interface InterviewSchedule {
  candidateId: string
  date: string
  time: string
  notes: string
}

export default function RecruiterDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('fit-score')
  const [interviews, setInterviews] = useState<InterviewSchedule[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null)
  const [overrides, setOverrides] = useState<Record<string, boolean>>({})
  const [candidates, setCandidates] = useState(mockCandidates)

  useEffect(() => {
    const saved = localStorage.getItem('student_overrides')
    if (saved) setOverrides(JSON.parse(saved))

    const fetchCandidates = async () => {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { data: academicsData } = await supabase.from('academics').select('*, profiles(full_name, email)')

      if (academicsData && academicsData.length > 0) {
        const realCandidates = academicsData.map((record: any) => ({
          id: record.student_id,
          name: record.profiles?.full_name || 'Unknown Student',
          email: record.profiles?.email || '',
          gpa: record.gpa || 0,
          frontend: record.frontend_skill || 0,
          backend: record.backend_skill || 0,
          dsa: record.dsa_skill || 0,
          experience: 0,
          verified: record.verification_status === 'verified',
          manualOverride: false
        }))
        // Prepend real candidates to mock ones to show both for demo
        setCandidates([...realCandidates, ...mockCandidates])
      }
    }
    fetchCandidates()
  }, [])

  const calculateFitScore = (candidate: typeof mockCandidates[0]) => {
    const avgSkill =
      (candidate.frontend + candidate.backend + candidate.dsa) / 3
    const avgRequired =
      (jobRequirements.frontend + jobRequirements.backend + jobRequirements.dsa) / 3
    const skillMatch = Math.max(0, Math.min(100, avgSkill - (avgRequired - 80)))
    const gpaBonus = (candidate.gpa / 10) * 20
    const verificationBonus = candidate.verified ? 10 : 0
    return Math.round(skillMatch + gpaBonus + verificationBonus)
  }

  const filteredCandidates = candidates
    .map(c => ({ ...c, manualOverride: overrides[c.id] ?? c.manualOverride }))
    .filter((c) => {
      const meetsCgpaPolicy = Number(c.gpa.toFixed(2)) >= Number(jobRequirements.min_cgpa.toFixed(2)) || c.manualOverride
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
      return meetsCgpaPolicy && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'fit-score') {
        return calculateFitScore(b) - calculateFitScore(a)
      }
      if (sortBy === 'gpa') {
        return b.gpa - a.gpa
      }
      return a.name.localeCompare(b.name)
    })


  const handleScheduleInterview = async (candidateId: string, candidateName: string, date: string, time: string, notes: string) => {
    const candidateEmail = candidates.find(c => c.id === candidateId)?.email || 'student@college.edu'
    const result = await scheduleInterviewAction(candidateName, candidateEmail, date, time, notes)

    if (result.success) {
      setInterviews((prev) => [...prev, { candidateId, date, time, notes }])
      setSelectedCandidate(null)
      toast.success(`Interview scheduled and invitation sent to ${candidateName}!`)
    } else {
      toast.error(result.error || 'Failed to schedule interview')
    }
  }

  return (
    <div className="relative min-h-screen pb-24">
      <div className="gradient-background" />
      <div className="glow-orb-2 opacity-50" />

      <main className="relative mx-auto max-w-7xl px-6 pt-32">
        {/* Job Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 fade-in-up">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2.5 rounded-lg text-primary">
                <Briefcase className="h-6 w-6" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Frontend Developer</h1>
            </div>
            <p className="text-xl text-muted-foreground ml-[52px]">Your Company Inc.</p>
          </div>

          <div className="flex gap-4">
            <div className="glass-light px-6 py-4 rounded-2xl flex flex-col items-center">
              <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Candidates</span>
              <span className="text-3xl font-bold">{filteredCandidates.length}</span>
            </div>
            <div className="glass-light px-6 py-4 rounded-2xl flex flex-col items-center border-primary/20 bg-primary/5">
              <span className="text-sm text-primary uppercase tracking-wider font-semibold mb-1">Scheduled</span>
              <span className="text-3xl font-bold text-primary">{interviews.length}</span>
            </div>
          </div>
        </div>

        {/* Requirements Strip */}
        <div className="glass p-6 rounded-2xl mb-12 flex flex-wrap gap-8 items-center justify-center fade-in-up delay-100">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Min Frontend</p>
            <p className="text-2xl font-bold text-cyan-500">{jobRequirements.frontend}</p>
          </div>
          <div className="w-px h-12 bg-border hidden sm:block"></div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Min Backend</p>
            <p className="text-2xl font-bold text-indigo-500">{jobRequirements.backend}</p>
          </div>
          <div className="w-px h-12 bg-border hidden sm:block"></div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Min DSA</p>
            <p className="text-2xl font-bold text-rose-500">{jobRequirements.dsa}</p>
          </div>
          <div className="w-px h-12 bg-border hidden sm:block"></div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Hard Policy: CGPA</p>
            <p className="text-2xl font-bold text-foreground">{jobRequirements.min_cgpa}</p>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="bento-card fade-in-up delay-200">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Talent Pool</h2>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-background/50 border-border"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-11 pl-10 pr-4 rounded-md border border-border bg-background/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                >
                  <option value="fit-score">Sort by Fit Score</option>
                  <option value="gpa">Sort by GPA</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="border-b border-border/50 text-muted-foreground">
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider text-xs">Name & Contact</th>
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider text-xs">Metrics</th>
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider text-xs">Skills Breakdown</th>
                  <th className="px-6 py-4 text-center font-semibold uppercase tracking-wider text-xs">Match</th>
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 text-right font-semibold uppercase tracking-wider text-xs">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredCandidates.map((candidate) => {
                  const fitScore = calculateFitScore(candidate)
                  const hasInterview = interviews.some((i) => i.candidateId === candidate.id)
                  const fitScoreBg =
                    fitScore >= 80
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : fitScore >= 60
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'

                  return (
                    <tr
                      key={candidate.id}
                      className="transition-colors hover:bg-muted/30 group"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold text-base mb-1">{candidate.name}</p>
                        <p className="text-muted-foreground text-xs">{candidate.email}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground w-8">GPA</span>
                          <span className="font-medium">{candidate.gpa.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 min-w-[200px]">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-12 text-right">Front</span>
                            <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                              <div className="h-full rounded-full bg-cyan-500" style={{ width: `${candidate.frontend}%` }} />
                            </div>
                            <span className="text-xs font-medium w-6">{candidate.frontend}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-12 text-right">Back</span>
                            <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${candidate.backend}%` }} />
                            </div>
                            <span className="text-xs font-medium w-6">{candidate.backend}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-12 text-right">DSA</span>
                            <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                              <div className="h-full rounded-full bg-rose-500" style={{ width: `${candidate.dsa}%` }} />
                            </div>
                            <span className="text-xs font-medium w-6">{candidate.dsa}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-sm font-bold border ${fitScoreBg} shadow-inner`}>
                          {fitScore}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          {candidate.verified && (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                              Verified
                            </Badge>
                          )}
                          {candidate.manualOverride && (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                              Overridden
                            </Badge>
                          )}
                          {hasInterview && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              Scheduled
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant={hasInterview ? 'secondary' : 'default'}
                              className={hasInterview ? '' : 'shadow-md shadow-primary/20'}
                              onClick={() => setSelectedCandidate(candidate.id)}
                            >
                              {hasInterview ? 'View Details' : 'Schedule'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="glass-dark border-border/50 text-foreground">
                            {hasInterview ? (
                              <>
                                <DialogHeader>
                                  <DialogTitle className="text-2xl">Interview Details</DialogTitle>
                                  <DialogDescription className="text-muted-foreground">
                                    Upcoming technical review with <span className="font-semibold text-foreground">{candidate.name}</span>.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                  {interviews.filter(i => i.candidateId === candidate.id).map((interview, index) => (
                                    <div key={index} className="bg-background/50 border border-border p-4 rounded-lg space-y-2">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Date / Time</span>
                                        <span className="font-medium text-foreground">{interview.date} at {interview.time}</span>
                                      </div>
                                      {interview.notes && (
                                        <div className="pt-2 border-t border-border/50">
                                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">Notes</span>
                                          <p className="text-sm text-foreground">{interview.notes}</p>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <>
                                <DialogHeader>
                                  <DialogTitle className="text-2xl">Schedule Interview</DialogTitle>
                                  <DialogDescription className="text-muted-foreground">
                                    Set up a technical review with <span className="font-semibold text-foreground">{candidate.name}</span>.
                                  </DialogDescription>
                                </DialogHeader>
                                <InterviewScheduleForm
                                  onSubmit={(date, time, notes) =>
                                    handleScheduleInterview(candidate.id, candidate.name, date, time, notes)
                                  }
                                />
                              </>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredCandidates.length === 0 && (
              <div className="text-center py-16">
                <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg font-medium">No candidates found</p>
                <p className="text-sm text-muted-foreground">Adjust your search parameters to find matching talent.</p>
              </div>
            )}
          </div>
        </div>
        <Toaster />
      </main>
    </div>
  )
}

function InterviewScheduleForm({
  onSubmit,
}: {
  onSubmit: (date: string, time: string, notes: string) => void
}) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(date, time, notes)
        setDate('')
        setTime('')
        setNotes('')
      }}
      className="space-y-6 pt-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="bg-background/50 border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time" className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Time</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="bg-background/50 border-border"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-muted-foreground uppercase text-xs font-bold tracking-wider">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add agenda, specific interviewers, or focus areas..."
          className="bg-background/50 border-border min-h-[100px]"
        />
      </div>
      <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20">
        Confirm & Send Invite
      </Button>
    </form>
  )
}
