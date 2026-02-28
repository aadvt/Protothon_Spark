'use client'

import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface KnowledgeTreeProps {
    skills: Record<string, number>
}

const CATEGORIES = {
    foundation: ['Array', 'String', 'Hash Table', 'Sorting', 'Math'],
    intermediate: ['Stack', 'Queue', 'Linked List', 'Two Pointers', 'Sliding Window', 'Binary Search'],
    advanced: ['Dynamic Programming', 'Greedy', 'Backtracking', 'Bit Manipulation', 'Divide and Conquer']
}

export const KnowledgeTree: React.FC<KnowledgeTreeProps> = ({ skills }) => {
    const getLevel = (count: number) => {
        if (count >= 50) return 'expert'
        if (count >= 20) return 'proficient'
        if (count > 0) return 'apprentice'
        return 'locked'
    }

    const getColor = (level: string) => {
        switch (level) {
            case 'expert': return 'stroke-indigo-500 fill-indigo-500'
            case 'proficient': return 'stroke-emerald-500 fill-emerald-500'
            case 'apprentice': return 'stroke-amber-500 fill-amber-500'
            default: return 'stroke-muted/20 fill-muted/10'
        }
    }

    const renderNode = (name: string, x: number, y: number, delay: number) => {
        const count = skills[name] || 0
        const level = getLevel(count)
        const isActive = level !== 'locked'

        return (
            <TooltipProvider key={name}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <g
                            transform={`translate(${x}, ${y}) scale(${isActive ? 1.2 : 1})`}
                            className="cursor-help transition-transform duration-500 hover:scale-150"
                            style={{
                                animation: `nodeAppear 0.5s ease-out ${delay}s both`
                            }}
                        >
                            <circle
                                cx={0}
                                cy={0}
                                r={isActive ? 8 : 6}
                                className={`transition-all duration-500 ${getColor(level)} ${isActive ? 'stroke-2' : 'stroke-1'}`}
                                style={level === 'expert' ? { filter: 'drop-shadow(0 0 5px rgba(99, 102, 241, 1))' } : {}}
                            />
                            {isActive && (
                                <circle
                                    cx={0}
                                    cy={0}
                                    r={12}
                                    className="fill-none stroke-current opacity-20 animate-pulse"
                                />
                            )}
                        </g>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-popover/90 backdrop-blur-md border-white/10">
                        <div className="flex flex-col gap-1">
                            <span className="font-bold text-sm tracking-tight">{name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{level}</span>
                            <span className="text-xs font-medium text-primary mt-1">{count} Solved</span>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }

    return (
        <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden rounded-3xl bg-black/5 dark:bg-white/[0.02] border border-white/5 p-8">
            <style jsx>{`
                @keyframes nodeAppear {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes pathReveal {
                    from { stroke-dashoffset: 1000; }
                    to { stroke-dashoffset: 0; }
                }
            `}</style>

            <svg viewBox="0 0 400 500" className="w-full h-full max-w-md drop-shadow-2xl">
                {/* Connections */}
                <g className="opacity-20">
                    {/* Detailed Path drawing can be added here with stroke-dasharray */}
                    <line x1="200" y1="450" x2="200" y2="350" className="stroke-muted-foreground stroke-2" />

                    {[100, 150, 200, 250, 300].map((x, i) => (
                        <path key={`f-i-${i}`} d={`M ${x} 450 Q 200 400 200 350`} fill="none" className="stroke-muted-foreground stroke-1" />
                    ))}

                    {[80, 140, 200, 260, 320].map((x, i) => (
                        <path key={`i-a-${i}`} d={`M 200 350 Q 200 250 ${x} 150`} fill="none" className="stroke-muted-foreground stroke-1" />
                    ))}

                    {[50, 120, 200, 280, 350].map((x, i) => (
                        <path key={`a-t-${i}`} d={`M ${[80, 140, 200, 260, 320][i]} 150 Q ${x} 100 ${x} 50`} fill="none" className="stroke-muted-foreground stroke-1" />
                    ))}
                </g>

                {/* Categories */}
                {CATEGORIES.foundation.map((name, i) => renderNode(name, 100 + i * 50, 450, 0.1 * i))}
                {CATEGORIES.intermediate.map((name, i) => renderNode(name, 80 + i * 48, 250, 0.5 + 0.1 * i))}
                {CATEGORIES.advanced.map((name, i) => renderNode(name, 50 + i * 75, 100, 1 + 0.1 * i))}

                <text x="50" y="480" className="text-[10px] font-bold fill-muted-foreground uppercase tracking-widest opacity-40">Foundation</text>
                <text x="50" y="280" className="text-[10px] font-bold fill-muted-foreground uppercase tracking-widest opacity-40">Intermediate</text>
                <text x="50" y="130" className="text-[10px] font-bold fill-muted-foreground uppercase tracking-widest opacity-40">Mastery</text>
            </svg>

            {/* Legend */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                <div className="flex gap-4 bg-background/50 backdrop-blur-md p-3 rounded-xl border border-white/10 pointer-events-auto">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="text-[8px] font-bold text-muted-foreground uppercase">Expert</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[8px] font-bold text-muted-foreground uppercase">Proficient</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span className="text-[8px] font-bold text-muted-foreground uppercase">Learner</span>
                    </div>
                </div>
                <div className="italic text-[10px] text-muted-foreground opacity-50 text-right">
                    Visual Architecture of Data Structures
                </div>
            </div>
        </div>
    )
}
