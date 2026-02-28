'use client'

import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Briefcase, GraduationCap } from 'lucide-react'
import { useState } from 'react'

const mockCandidates = [
    {
        id: '1',
        name: 'Aarav Patel',
        email: 'aarav.patel@college.edu',
        gpa: 3.8,
        graduation: 2024,
        skills: ['React', 'Node.js', 'Python'],
        location: 'Bangalore, India',
        verified: true
    },
    {
        id: '2',
        name: 'Priya Sharma',
        email: 'priya.sharma@college.edu',
        gpa: 3.9,
        graduation: 2024,
        skills: ['Figma', 'System Design', 'React'],
        location: 'Mumbai, India',
        verified: true
    },
    {
        id: '3',
        name: 'Rohan Gupta',
        email: 'rohan.gupta@college.edu',
        gpa: 3.6,
        graduation: 2024,
        skills: ['Java', 'Spring Boot', 'AWS'],
        location: 'Pune, India',
        verified: true
    },
    {
        id: '4',
        name: 'Sneha Singh',
        email: 'sneha.singh@college.edu',
        gpa: 3.7,
        graduation: 2024,
        skills: ['C++', 'DSA', 'SQL'],
        location: 'Delhi, India',
        verified: false
    },
]

export default function CandidatesPage() {
    const [searchQuery, setSearchQuery] = useState('')

    const filteredCandidates = mockCandidates.filter(
        (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <>
            <Header userRole="recruiter" />
            <main className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold mb-4">Talent Pool</h1>
                        <p className="text-muted-foreground text-lg">
                            Find and connect with top-tier graduates ready for their next challenge.
                        </p>
                    </div>

                    <div className="glass p-8 mb-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or skills..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {filteredCandidates.map((candidate) => (
                            <div key={candidate.id} className="glass-light p-6 transition-all hover:shadow-md">
                                <div className="flex flex-col h-full gap-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold mb-1">{candidate.name}</h3>
                                            <p className="text-sm text-primary font-medium">{candidate.email}</p>
                                        </div>
                                        {candidate.verified && (
                                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs rounded-full font-bold">
                                                VERIFIED
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="h-4 w-4" />
                                            <span>GPA: {candidate.gpa}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-4 w-4" />
                                            <span>Class of {candidate.graduation}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>{candidate.location}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-tight">Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {candidate.skills.map((skill) => (
                                                <span key={skill} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 flex gap-2">
                                        <Button variant="outline" className="flex-1">View Profile</Button>
                                        <Button className="flex-1">Contact</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredCandidates.length === 0 && (
                        <div className="text-center py-24 glass">
                            <p className="text-muted-foreground">No candidates found matching your search.</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}
