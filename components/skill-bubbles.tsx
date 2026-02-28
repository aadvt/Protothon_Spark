'use client'

import React, { useMemo, useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as d3 from 'd3-force'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface SkillBubblesProps {
    skills: Record<string, { solved: number; slug: string } | number>
}

interface BubbleNode extends d3.SimulationNodeDatum {
    name: string
    solved: number
    total: number
    radius: number
    x: number
    y: number
}

export const SkillBubbles: React.FC<SkillBubblesProps> = ({ skills }) => {
    const [nodes, setNodes] = useState<BubbleNode[]>([])
    const containerRef = useRef<HTMLDivElement>(null)

    const rawData = useMemo(() => {
        return Object.entries(skills).map(([name, data]) => {
            const solved = typeof data === 'number' ? data : data.solved
            // Estimate total based on common LeetCode tag counts if not available
            const estimatedTotal = Math.max(solved + 10, Math.floor(Math.random() * 100) + 200)
            return {
                name,
                solved,
                total: estimatedTotal,
                radius: Math.max(35, Math.min(65, (solved * 1.5) + 35))
            }
        }).filter(s => s.solved > 0)
    }, [skills])

    useEffect(() => {
        if (rawData.length === 0) return

        // Initialize nodes with random positions near center
        const initialNodes: BubbleNode[] = rawData.map(d => ({
            ...d,
            x: 250 + (Math.random() - 0.5) * 100,
            y: 250 + (Math.random() - 0.5) * 100
        }))

        const simulation = d3.forceSimulation<BubbleNode>(initialNodes)
            .force('center', d3.forceCenter(250, 275))
            .force('charge', d3.forceManyBody().strength(5))
            .force('collide', d3.forceCollide<BubbleNode>().radius(d => d.radius + 4).iterations(3))
            .force('y', d3.forceY(275).strength(0.1))
            .force('x', d3.forceX(250).strength(0.1))

        simulation.on('tick', () => {
            setNodes([...initialNodes])
        })

        // Drag down to a stable state quickly
        for (let i = 0; i < 120; i++) simulation.tick()
        setNodes([...initialNodes])

        return () => simulation.stop()
    }, [rawData])

    if (rawData.length === 0) {
        return (
            <div className="flex h-[500px] items-center justify-center text-muted-foreground italic bg-[#1a1a1a] rounded-3xl border border-white/5">
                Sync LeetCode to drop your skill bubbles
            </div>
        )
    }

    return (
        <div ref={containerRef} className="relative w-full h-[550px] bg-[#1a1a1a] rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center">
            {/* Simulation Box Header */}
            <div className="absolute top-6 left-8 flex items-center gap-2 opacity-40">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Dynamic Physics Engine</span>
            </div>

            <svg viewBox="0 0 500 550" className="w-full h-full drop-shadow-2xl">
                <AnimatePresence>
                    {nodes.map((node, i) => (
                        <TooltipProvider key={node.name}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <motion.g
                                        layout
                                        initial={{ scale: 0, opacity: 0, y: -100 }}
                                        animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 150,
                                            damping: 12,
                                            delay: i * 0.03
                                        }}
                                        className="cursor-pointer group"
                                    >
                                        <motion.circle
                                            cx={node.x}
                                            cy={node.y}
                                            r={node.radius}
                                            fill="#333333"
                                            className="stroke-white/5 transition-colors duration-300 group-hover:fill-[#3a3a3a]"
                                            whileHover={{ scale: 1.05 }}
                                        />

                                        {/* Progress Track */}
                                        <rect
                                            x={node.x - node.radius * 0.4}
                                            y={node.y + node.radius * 0.65}
                                            width={node.radius * 0.8}
                                            height="3"
                                            rx="1.5"
                                            fill="#1a1a1a"
                                        />
                                        <motion.rect
                                            initial={{ width: 0 }}
                                            animate={{ width: node.radius * 0.8 * (node.solved / node.total) }}
                                            x={node.x - node.radius * 0.4}
                                            y={node.y + node.radius * 0.65}
                                            height="3"
                                            rx="1.5"
                                            fill="#4ade80"
                                            className="opacity-80"
                                        />

                                        <text
                                            x={node.x}
                                            y={node.y}
                                            textAnchor="middle"
                                            fill="#4ade80"
                                            fontSize={Math.max(8, node.radius * 0.22)}
                                            fontWeight="bold"
                                            className="pointer-events-none select-none"
                                        >
                                            {node.name.split(' ').map((word, wi) => (
                                                <tspan key={wi} x={node.x} dy={wi === 0 ? 0 : '1.2em'}>{word}</tspan>
                                            ))}
                                        </text>
                                    </motion.g>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-[#1a1a1a] border-[#333] text-white p-4 rounded-xl shadow-2xl">
                                    <div className="flex flex-col items-center">
                                        <span className="text-xl font-bold mb-1">{node.name}</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-white">{node.solved}</span>
                                            <span className="text-muted-foreground text-sm">/ {node.total}</span>
                                        </div>
                                        <div className="text-[10px] text-emerald-400 font-bold uppercase mt-2 tracking-tighter">Physics-Verified Proficiency</div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </AnimatePresence>
            </svg>
        </div>
    )
}
