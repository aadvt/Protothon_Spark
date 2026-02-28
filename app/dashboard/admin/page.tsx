'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Search, TrendingUp, Users, CheckCircle, AlertCircle,
  ShieldAlert, ShieldCheck, Activity, Brain, Target,
  ArrowUpRight, Bell, Calendar, Loader2, Filter,
  Database, RefreshCcw, Briefcase, Settings
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

// Mock batch data for heatmap
const skillHeatmapData = [
  { skill: 'Frontend', count: 145, avg: 72, high: 95 },
  { skill: 'Backend', count: 145, avg: 68, high: 92 },
  { skill: 'DSA', count: 145, avg: 81, high: 98 },
  { skill: 'System Design', count: 145, avg: 45, high: 78 },
  { skill: 'Database', count: 145, avg: 64, high: 88 },
]

// Mock audit log data
const auditLogData = [
  {
    id: '1',
    timestamp: '14:32',
    admin: 'Ayush (Admin)',
    action: 'Verified Record',
    target: 'Aarav Patel',
    status: 'success',
  },
  {
    id: '2',
    timestamp: '13:20',
    admin: 'Ayush (Admin)',
    action: 'Override Granted',
    target: 'Rohan Gupta',
    status: 'warning',
  },
  {
    id: '3',
    timestamp: '11:10',
    admin: 'Ayush (Admin)',
    action: 'System Sync',
    target: 'LeetCode API Gateway',
    status: 'success',
  },
]

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAdminLoading, setIsAdminLoading] = useState(true)
  const [adminProfile, setAdminProfile] = useState<any>(null)
  const [overrides, setOverrides] = useState<Record<string, boolean>>({})
  const [stats, setStats] = useState({
    totalStudents: 145,
    verifiedStudents: 138,
    placedStudents: 92,
    avgGPA: 8.41,
    avgSkillScore: 78,
  })

  // Policy Toggles state
  const [policySingleDream, setPolicySingleDream] = useState(true)
  const [policyResume, setPolicyResume] = useState(true)
  const [policyLeaderboard, setPolicyLeaderboard] = useState(false)

  const handlePolicyToggle = (policy: string) => {
    if (policy === 'dream') {
      setPolicySingleDream(!policySingleDream)
      toast.info(`Single Dream Offer policy ${!policySingleDream ? 'enabled' : 'disabled'}`)
    } else if (policy === 'resume') {
      setPolicyResume(!policyResume)
      toast.info(`Resume Uploads ${!policyResume ? 'enabled' : 'disabled'}`)
    } else if (policy === 'leaderboard') {
      setPolicyLeaderboard(!policyLeaderboard)
      toast.info(`Public Leaderboard ${!policyLeaderboard ? 'enabled' : 'disabled'}`)
    }
  }

  const supabase = createClient()

  useEffect(() => {
    const fetchAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (profile) {
          setAdminProfile({
            name: profile.full_name,
            firstName: profile.full_name?.split(' ')[0] || 'Admin',
            email: profile.email
          })
        }
      }
      setIsAdminLoading(false)
    }

    const savedOverrides = localStorage.getItem('student_overrides')
    if (savedOverrides) setOverrides(JSON.parse(savedOverrides))

    fetchAdmin()
  }, [])

  const toggleOverride = (studentId: string) => {
    const newOverrides = { ...overrides, [studentId]: !overrides[studentId] }
    setOverrides(newOverrides)
    localStorage.setItem('student_overrides', JSON.stringify(newOverrides))
    toast.success(`Governance override updated for ID: ${studentId}`)
  }

  if (isAdminLoading) {
    return <div className="min-h-screen flex items-center justify-center pt-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="relative min-h-screen pb-24 dark bg-[#0a0a0c]">
      <div className="gradient-background fixed inset-0 z-0 opacity-20 pointer-events-none" />

      <Header userRole="admin" userName={adminProfile?.name} />

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-32">

        {/* 1. Header & Quick Actions */}
        <div className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
              <ShieldAlert className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tight text-white mb-1">
                Governance <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">Console</span>
              </h1>
              <div className="flex items-center gap-3">
                <p className="text-zinc-500 font-bold tracking-tight">Active Warden: {adminProfile?.name}</p>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            </div>
          </motion.div>

          <div className="flex items-center gap-3">
            <Button onClick={() => toast.promise(new Promise(resolve => setTimeout(resolve, 800)), { loading: 'Syncing with College ERP...', success: 'Master Database Synced!', error: 'Sync Failed' })} variant="outline" className="glass h-12 rounded-2xl border-white/5 font-black uppercase tracking-widest text-[9px] hover:bg-white/5 flex items-center gap-3">
              <RefreshCcw className="w-4 h-4" /> Global Re-Sync
            </Button>
            <Button onClick={() => toast.success('Audit_Ledger_Q1.csv downloaded successfully')} className="bg-primary text-black h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform">
              Download Audit Ledger
            </Button>
          </div>
        </div>

        {/* 2. Top-Level Batch Metrics */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          {[
            { label: 'Verified Batch', value: stats.verifiedStudents, sub: '145 Total Students', icon: ShieldCheck, color: 'text-emerald-400' },
            { label: 'Placement Rate', value: '63.4%', sub: '92 Active Placements', icon: TrendingUp, color: 'text-primary' },
            { label: 'Batch MSA', value: stats.avgSkillScore, sub: 'Mastery Skill Average', icon: Brain, color: 'text-indigo-400' },
            { label: 'Pending Audits', value: '12', sub: 'Action Required', icon: AlertCircle, color: 'text-rose-400' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bento-card border-white/5 bg-gradient-to-br from-white/5 to-transparent p-6 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/20" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 mb-1">{stat.label}</p>
                <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-2">{stat.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. Main Data Core */}
        <div className="grid gap-6 md:grid-cols-12 mb-8 items-stretch">

          {/* Batch Skill Heatmap */}
          <div className="md:col-span-8 bento-card border-none bg-zinc-900/40 backdrop-blur-md p-10 flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase">Batch Skill Intelligence</h2>
                <p className="text-[10px] font-black text-muted-foreground uppercase opacity-40 tracking-[0.3em] mt-1">Industrial Readiness Distribution</p>
              </div>
              <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl border-white/5">
                <Database className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Aggregated Verification</span>
              </div>
            </div>

            <div className="flex-1 min-h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillHeatmapData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis
                    dataKey="skill"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#ffffff50', fontSize: 10, fontWeight: 900 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#ffffff30', fontSize: 10 }}
                  />
                  <Tooltip
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  />
                  <Bar dataKey="avg" radius={[8, 8, 8, 8]} barSize={40}>
                    {skillHeatmapData.map((entry, index) => (
                      <Cell key={index} fill={index % 2 === 0 ? '#4ade80' : '#818cf8'} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Audit Ledger */}
          <div className="md:col-span-4 bento-card border-none bg-[#111114] p-10 flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-rose-500" />
                <h2 className="text-xl font-black text-white tracking-tight uppercase">Audit Trail</h2>
              </div>
              <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[8px] px-2">Live Logs</Badge>
            </div>
            <div className="space-y-6 flex-1">
              {auditLogData.map((log) => (
                <div key={log.id} className="group relative pl-4 border-l border-white/5 hover:border-primary/30 transition-colors">
                  <span className="text-[10px] font-mono text-white/20 absolute -left-[1px] top-0 -translate-x-1/2 bg-[#111114] px-1">
                    {log.timestamp}
                  </span>
                  <div className="mb-1">
                    <p className="text-xs font-black text-white uppercase tracking-widest">{log.action}</p>
                    <p className="text-[9px] font-bold text-muted-foreground truncate opacity-40">TARGET: {log.target}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${log.status === 'success' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">{log.admin}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => toast.info('Full system event logs are being compiled. Check your registered inbox in 5 minutes.')} variant="link" className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40 hover:text-primary mt-10 p-0 text-left">
              View Full System Event Log
            </Button>
          </div>
        </div>

        {/* 4. Policy Oversight Table */}
        <div className="fade-in-up delay-400 relative">
          <div className="absolute -top-20 -right-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-1 bg-primary rounded-full" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">Policy Oversight</span>
              </div>
              <h2 className="text-5xl font-black tracking-tighter text-white uppercase italic">Manual Overrides</h2>
              <p className="text-muted-foreground font-medium mt-2 max-w-lg opacity-70">Manage industrial verification exceptions and manual bypasses for special recruitment cases.</p>
            </div>
            <div className="relative w-full md:w-[450px] group">
              <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Filter by student, GPA or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-16 h-16 bg-zinc-900/50 backdrop-blur-3xl border-white/5 rounded-2xl focus:ring-primary/30 text-white font-bold text-lg relative z-10 shadow-3xl"
              />
            </div>
          </div>

          <div className="glass-light rounded-[2.5rem] border border-white/5 overflow-hidden shadow-3xl relative z-10">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 font-black text-[10px] text-white/40 uppercase tracking-[0.3em] border-b border-white/5">
                    <th className="px-10 py-8">Candidate Profile</th>
                    <th className="px-10 py-8 text-center">Academic Proof</th>
                    <th className="px-10 py-8 text-center">Gate Governance</th>
                    <th className="px-10 py-8 text-right">System Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { id: '1', name: 'Aarav Patel', email: 'aarav.p@collage.in', gpa: 9.2, verified: true, role: 'L4 High Potential' },
                    { id: '2', name: 'Priya Sharma', email: 'priya.s@collage.in', gpa: 8.9, verified: true, role: 'Verified' },
                    { id: '3', name: 'Rohan Gupta', email: 'rohan.g@collage.in', gpa: 7.2, verified: false, role: 'Manual Exception' },
                    { id: '4', name: 'Aditi Verma', email: 'aditi.v@collage.in', gpa: 8.5, verified: true, role: 'Verified' },
                  ].map((student) => (
                    <tr key={student.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center font-black text-white group-hover:scale-105 transition-transform">
                            {student.name[0]}
                          </div>
                          <div>
                            <p className="font-black text-white text-lg tracking-tight mb-1">{student.name}</p>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-2xl font-black text-white font-mono tracking-tighter">{student.gpa.toFixed(1)}</span>
                          {student.verified ? (
                            <div className="flex items-center gap-1 text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                              <Target className="w-2.5 h-2.5" /> SECURE
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[8px] font-black text-rose-400 uppercase tracking-widest bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10">
                              <AlertCircle className="w-2.5 h-2.5" /> AUDIT
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        {overrides[student.id] ? (
                          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-2 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-amber-500/5 animate-pulse">
                            <ShieldAlert className="w-3.5 h-3.5" /> Bypass Active
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/5 text-white/30 px-4 py-2 rounded-2xl font-black text-[9px] uppercase tracking-widest">
                            <ShieldCheck className="w-3.5 h-3.5" /> Standard Ops
                          </div>
                        )}
                      </td>
                      <td className="px-10 py-8 text-right">
                        <Button
                          onClick={() => toggleOverride(student.id)}
                          variant={overrides[student.id] ? "destructive" : "outline"}
                          className={`h-12 rounded-xl px-8 font-black uppercase tracking-widest text-[9px] transition-all ${!overrides[student.id] ? 'border-white/10 hover:border-amber-500/50 hover:text-amber-500 glass' : ''}`}
                        >
                          {overrides[student.id] ? 'Revoke Bypass' : 'Grant Exception'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 5. Additional Dash Controls */}
        <div className="grid gap-6 md:grid-cols-3 mb-8 mt-12 items-stretch">
          {/* Company Pipeline */}
          <div className="bento-card border-none bg-zinc-900/40 backdrop-blur-md p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-black text-white tracking-tight uppercase">Company Pipeline</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Upcoming</span>
                  <span className="text-lg font-black text-white">4 Drives</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Ongoing</span>
                  <span className="text-lg font-black text-emerald-400">2 Active</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Completed</span>
                  <span className="text-lg font-black text-white">12 Drives</span>
                </div>
              </div>
            </div>
          </div>

          {/* Broadcast Engine */}
          <div className="bento-card border-none bg-zinc-900/40 backdrop-blur-md p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-black text-white tracking-tight uppercase">Broadcast Engine</h2>
              </div>
              <p className="text-xs text-muted-foreground mb-6 font-medium leading-relaxed">Instantly transmit emergency updates, schedule changes, or bulk alerts to the entire targeted batch directly via WhatsApp or Email.</p>
              <Button onClick={() => toast.info('Broadcast Engine opening... (Integration Placeholder)')} className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/5 h-12 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all">
                Compose Alert
              </Button>
            </div>
          </div>

          {/* Policy Manager */}
          <div className="bento-card border-none bg-zinc-900/40 backdrop-blur-md p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-black text-white tracking-tight uppercase">Policy Manager</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400 font-bold uppercase">Single Dream Offer</span>
                  <div onClick={() => handlePolicyToggle('dream')} className={`w-10 h-5 rounded-full flex items-center p-1 cursor-pointer transition-colors ${policySingleDream ? 'bg-emerald-500 opacity-80 shadow-inner' : 'bg-white/10 shadow-inner'}`}>
                    <motion.div layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className={`w-3.5 h-3.5 rounded-full shadow-sm ${policySingleDream ? 'bg-black ml-auto' : 'bg-zinc-400'}`} />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400 font-bold uppercase">Resume Uploads</span>
                  <div onClick={() => handlePolicyToggle('resume')} className={`w-10 h-5 rounded-full flex items-center p-1 cursor-pointer transition-colors ${policyResume ? 'bg-emerald-500 opacity-80 shadow-inner' : 'bg-white/10 shadow-inner'}`}>
                    <motion.div layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className={`w-3.5 h-3.5 rounded-full shadow-sm ${policyResume ? 'bg-black ml-auto' : 'bg-zinc-400'}`} />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400 font-bold uppercase">Public Leaderboard</span>
                  <div onClick={() => handlePolicyToggle('leaderboard')} className={`w-10 h-5 rounded-full flex items-center p-1 cursor-pointer transition-colors ${policyLeaderboard ? 'bg-emerald-500 opacity-80 shadow-inner' : 'bg-white/10 shadow-inner'}`}>
                    <motion.div layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className={`w-3.5 h-3.5 rounded-full shadow-sm ${policyLeaderboard ? 'bg-black ml-auto' : 'bg-zinc-400'}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Toaster />
      </main>
    </div>
  )
}
