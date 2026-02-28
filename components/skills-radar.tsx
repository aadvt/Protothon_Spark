'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

interface SkillsRadarProps {
  frontend?: number
  backend?: number
  dsa?: number
  data?: Array<{ skill: string; value: number; fullMark: number }>
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark px-3 py-2 text-sm text-white border border-white/10 rounded-xl shadow-2xl">
        <p className="font-semibold mb-1 opacity-70">{payload[0].payload.skill}</p>
        <p className="text-primary font-mono text-lg font-bold">{payload[0].value}<span className="text-xs text-white/40 ml-1">/ 100</span></p>
      </div>
    )
  }
  return null
}

export function SkillsRadar({ frontend, backend, dsa, data: customData }: SkillsRadarProps) {
  const defaultData = [
    { skill: 'Frontend', value: frontend || 75, fullMark: 100 },
    { skill: 'Backend', value: backend || 80, fullMark: 100 },
    { skill: 'DSA', value: dsa || 70, fullMark: 100 },
  ]

  const displayData = customData || defaultData

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={displayData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Radar
            name="Proficiency"
            dataKey="value"
            stroke="#4ade80"
            strokeWidth={2}
            fill="url(#radarGradient)"
            fillOpacity={0.5}
            activeDot={{ r: 4, fill: '#4ade80', stroke: '#000', strokeWidth: 2 }}
          />
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
            </linearGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
