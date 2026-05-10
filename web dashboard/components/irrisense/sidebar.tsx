"use client"

import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Map,
  Droplets,
  Activity,
  Sliders,
  Leaf,
} from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { href: "#dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "#field-map", label: "Field Map", icon: Map },
  { href: "#sensors", label: "Sensor Data", icon: Activity },
  { href: "#irrigation", label: "Irrigation Control", icon: Droplets },
  { href: "#automation", label: "Automation", icon: Sliders },
]

export function Sidebar() {
  const [active, setActive] = useState<string>("#dashboard")

  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1))
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) {
          setActive(`#${visible[0].target.id}`)
        }
      },
      {
        // Trigger when section is roughly in the middle third of viewport
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden w-[220px] flex-col bg-[#1a1f2e] text-slate-200 lg:flex"
      aria-label="Primary"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-white/5 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#3a9e4f]/15 ring-1 ring-[#3a9e4f]/40">
          <Leaf className="h-[18px] w-[18px] text-[#4CAF50]" strokeWidth={2.25} />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-white">IrriSense</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Operations
        </p>
        <ul className="space-y-0.5">
          {nav.map((item) => {
            const Icon = item.icon
            const isActive = active === item.href
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-md px-3 py-2 text-[13.5px] transition-colors",
                    isActive
                      ? "bg-[#3a9e4f]/10 text-[#4CAF50]"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  )}
                  aria-current={isActive ? "true" : undefined}
                >
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-y-1.5 left-0 w-[3px] rounded-r bg-[#4CAF50]"
                    />
                  )}
                  <Icon className="h-[17px] w-[17px]" strokeWidth={2} />
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#3a9e4f] to-[#2d7a3a] text-sm font-semibold text-white">
              A
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#4CAF50] ring-2 ring-[#1a1f2e]" />
          </div>
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[13px] font-semibold text-white">Admin</div>
            <div className="truncate text-[11px] text-slate-400">Sfax Olive Farm</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
