import {
  Wifi,
  Server,
  HardDrive,
  Cpu,
  CalendarClock,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Status = "ok" | "syncing" | "standby" | "warn"

const statusStyles: Record<Status, { dot: string; text: string; bg: string }> = {
  ok: { dot: "bg-[#3a9e4f]", text: "text-[#2d7a3a]", bg: "bg-[#e8f5e9]" },
  syncing: { dot: "bg-[#3b82f6]", text: "text-[#1d4ed8]", bg: "bg-[#e0f2fe]" },
  standby: { dot: "bg-[#94a3b8]", text: "text-[#475569]", bg: "bg-[#eef2f6]" },
  warn: { dot: "bg-[#f59e0b]", text: "text-[#b45309]", bg: "bg-[#fff4e0]" },
}

const rows: { icon: LucideIcon; label: string; value: string; status: Status }[] = [
  { icon: Wifi, label: "LoRa Link", value: "Connected", status: "ok" },
  { icon: Server, label: "Supabase Sync", value: "Synced 30s ago", status: "syncing" },
  { icon: HardDrive, label: "SD Card Backup", value: "Standby", status: "standby" },
  { icon: Cpu, label: "STM32 Field Unit", value: "Online", status: "ok" },
  { icon: Cpu, label: "STM32 Gateway", value: "Online", status: "ok" },
]

export function SystemHealth() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-[#1a1f2e]">
            System Health
          </h3>
          <p className="text-[12px] text-[#6b7280]">All subsystems nominal</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-[#e8f5e9] px-2 py-1 text-[10.5px] font-semibold text-[#2d7a3a]">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#3a9e4f]" />
          HEALTHY
        </span>
      </div>

      <ul className="space-y-0.5">
        {rows.map((r) => {
          const s = statusStyles[r.status]
          const Icon = r.icon
          return (
            <li
              key={r.label}
              className="flex items-center justify-between rounded-md px-1 py-2 hover:bg-[#f4f6f9]"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#f4f6f9] text-[#1a1f2e]">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-[13px] font-medium text-[#1a1f2e]">{r.label}</span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2 py-0.5",
                  s.bg,
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
                <span className={cn("text-[11px] font-semibold", s.text)}>
                  {r.value}
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      {/* Next Scheduled Irrigation */}
      <div className="mt-auto rounded-lg border border-[#3a9e4f]/20 bg-gradient-to-br from-[#e8f5e9] to-white p-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#3a9e4f] text-white">
            <CalendarClock className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#2d7a3a]">
              Next Scheduled Irrigation
            </p>
            <p className="font-mono text-[13px] font-bold text-[#1a1f2e]">
              Today · 18:00 — 20 min
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
