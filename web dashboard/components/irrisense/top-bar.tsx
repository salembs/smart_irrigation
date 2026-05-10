"use client"

import { useEffect, useState } from "react"
import { Bell, Menu } from "lucide-react"

export function TopBar({ title }: { title: string }) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = now
    ? now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "--:--:--"
  const date = now
    ? now.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" })
    : ""

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#e5e7eb] bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#e5e7eb] text-[#1a1f2e] lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-[18px] font-semibold tracking-tight text-[#1a1f2e]">{title}</h1>
          <p className="hidden text-[12px] text-[#6b7280] md:block">
            Sfax, Tunisia • Olive Grove Block 07
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden items-center gap-2 rounded-md border border-[#e5e7eb] bg-[#f4f6f9] px-3 py-1.5 md:flex">
          <span className="text-[11px] uppercase tracking-wider text-[#6b7280]">{date}</span>
          <span className="h-3 w-px bg-[#e5e7eb]" />
          <span className="font-mono text-[13px] font-semibold text-[#1a1f2e]" suppressHydrationWarning>
            {time}
          </span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-[#3a9e4f]/30 bg-[#e8f5e9] px-2.5 py-1">
          <span className="relative flex h-2 w-2">
            <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#3a9e4f] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3a9e4f]" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2d7a3a]">
            Live
          </span>
        </div>

        <button
          type="button"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#e5e7eb] bg-white text-[#1a1f2e] hover:bg-[#f4f6f9]"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
        </button>
      </div>
    </header>
  )
}
