'use client'

import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Briefcase, DollarSign } from 'lucide-react'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const mockJobs = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Google',
    location: 'Mountain View, CA',
    salary: '120K-150K',
    description: 'Build beautiful user interfaces for millions of users.',
    tags: ['React', 'TypeScript', 'Next.js']
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'Microsoft',
    location: 'Seattle, WA',
    salary: '130K-160K',
    description: 'Work on cloud infrastructure and web applications.',
    tags: ['Azure', 'Node.js', 'React']
  },
  {
    id: '3',
    title: 'Backend Engineer',
    company: 'Amazon',
    location: 'Seattle, WA',
    salary: '140K-170K',
    description: 'Build scalable backend systems for AWS services.',
    tags: ['AWS', 'Java', 'DynamoDB']
  },
  {
    id: '4',
    title: 'UI/UX Designer',
    company: 'Apple',
    location: 'Cupertino, CA',
    salary: '110K-140K',
    description: 'Design the future of consumer electronics.',
    tags: ['Figma', 'System Design', 'Human Interface']
  },
]

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredJobs = mockJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Available Roles</h1>
            <p className="text-muted-foreground text-lg">
              Explore and apply for the most sought-after positions in top tech companies.
            </p>
          </div>

          <div className="glass p-8 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by role or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="glass-light p-6 transition-all hover:shadow-md">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        <span className="text-sm font-medium">{job.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm font-semibold text-primary">{job.salary}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="rounded-xl border-white/10 hover:bg-white/5">View Details</Button>
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
                              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Salary Range</p>
                              <p className="text-lg font-black text-white">{job.salary}</p>
                            </div>
                            <div className="glass p-4 rounded-2xl border-white/5">
                              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Work Location</p>
                              <p className="text-lg font-black text-white">{job.location}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Role Description</h4>
                            <p className="text-zinc-400 leading-relaxed font-medium">
                              {job.description} This is a mission-critical role at {job.company}. We are looking for an individual who can push the boundaries of technical excellence while maintaining a focus on user impact and scalable architecture.
                            </p>
                          </div>

                          <div>
                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Required Stack</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.tags.map((tag) => (
                                <span key={tag} className="px-4 py-2 bg-primary/10 text-primary text-xs rounded-xl border border-primary/20 font-black uppercase tracking-wider">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-10 border-t border-white/5 space-y-4">
                            <Button className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs hover:bg-primary/90 shadow-2xl shadow-primary/20">
                              Apply Now
                            </Button>
                            <p className="text-center text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">Direct response within 48 hours</p>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                    <Button className="rounded-xl">Apply Now</Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredJobs.length === 0 && (
              <div className="text-center py-24 glass">
                <p className="text-muted-foreground">No jobs found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
