'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

import Mesh from '../components/Mesh'

const ease = 'easeOut'

const stats = [
  { target: 9, label: 'Sessions' },
  { target: 20, label: 'Speakers' },
  { target: 1000, label: 'Attendees' },
]

function useCountUp(target: number, duration = 4000, triggered: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!triggered) return
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [triggered, target, duration])

  return count
}

function StatItem({
  target,
  label,
  triggered,
}: {
  target: number
  label: string
  triggered: boolean
}) {
  const count = useCountUp(target, 2000, triggered)
  return (
    <div>
      <div className="text-2xl font-semibold text-display text-[rgb(var(--accent))]">
        {count.toLocaleString()}+
      </div>
      <div className="mt-0.5 text-xs font-medium text-[rgb(var(--muted))] tracking-wide uppercase">
        {label}
      </div>
    </div>
  )
}

import { nodes, getColorClassesC } from "../constants";


export default function Hero() {
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Responsive radius and center calculation
  const getResponsiveDimensions = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) {
        return {
          radius: 100,
          centerX: 150,
          centerY: 150,
          viewBox: "0 0 300 300",
        };
      } else if (window.innerWidth < 1024) {
        return {
          radius: 140,
          centerX: 200,
          centerY: 200,
          viewBox: "0 0 400 400",
        };
      }
    }
    return { radius: 180, centerX: 250, centerY: 250, viewBox: "0 0 500 500" };
  };

  const { radius, centerX, centerY, viewBox } = getResponsiveDimensions();

  const getNodePosition = (angle: number) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian),
    };
  };

  const handleNodeInteraction = (nodeId: string) => {
  setSelectedNode((prev) => (prev === nodeId ? null : nodeId));
};


const activeNode = selectedNode ?? hoveredNode;


  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true)
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="container-pad pb-12 pt-8 sm:pb-16 sm:pt-12">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14">

        {/* Left — headline */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0 }}
          >
            <span className="section-label">AI-Powered Event Experience</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.08 }}
            className="mt-3 text-balance text-4xl font-semibold leading-[1.15] tracking-tight text-display sm:text-5xl lg:text-[3.25rem]"
          >
            A modern interactive experience—
            <span className="italic text-[rgb(var(--accent))]"> powered</span> by AI.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.16 }}
            className="mt-5 max-w-xl text-pretty text-base leading-7 text-[rgb(var(--muted))]"
          >
            Share your professional focus. We'll match it to the most relevant session,
            draft a personalised invitation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.24 }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <a href="#agenda" className="btn-ghost">Explore sessions</a>
            <a href="#invite" className="btn-primary">Generate my invite →</a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.32 }}
            className="mt-10 flex flex-wrap gap-6 border-t border-[rgb(var(--border))] pt-6"
          >
            {stats.map((s) => (
              <StatItem
                key={s.label}
                target={s.target}
                label={s.label}
                triggered={statsVisible}
              />
            ))}
          </motion.div>
        </div>

        {/* Right — how it works */}
         <Mesh
            radius={radius}
            centerX={centerX}
            centerY={centerY}
            viewBox={viewBox}
            nodes={nodes}
            activeNode={activeNode}
            setHoveredNode={setHoveredNode}
            handleNodeInteraction={handleNodeInteraction}
            getNodePosition={getNodePosition}
            getColorClasses={getColorClassesC}
          />

      </div>
    </section>
  )
}