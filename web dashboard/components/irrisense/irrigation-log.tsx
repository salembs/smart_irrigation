import { ArrowRight, Check, SkipForward, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Status = "completed" | "skipped" | "failed"

const rows: {
  time: string
  duration: string
  zone: "Zone A" | "Zone B"
  trigger: string
  status: Status
}[] = [
  { time: "10:30", duration: "18 min", zone: "Zone A", trigger: "Auto · Low Moisture", status: "completed" },
  { time: "07:00", duration: "12 min", zone: "Zone B", trigger: "Scheduled", status: "completed" },
  { time: "Yesterday · 18:00", duration: "—", zone: "Zone A", trigger: "Auto", status: "skipped" },
  { time: "Yesterday · 06:30", duration: "22 min", zone: "Zone B", trigger: "Manual · Admin", status: "completed" },
  { time: "2 days ago · 19:15", duration: "15 min", zone: "Zone A", trigger: "Scheduled", status: "completed" },
]

const statusStyles: Record<Status, { bg: string; text: string; label: string }> = {
  completed: { bg: "bg-[#e8f5e9]", text: "text-[#2d7a3a]", label: "Completed" },
  skipped: { bg: "bg-[#fff4e0]", text: "text-[#b45309]", label: "Skipped · Rain" },
  failed: { bg: "bg-red-50", text: "text-red-600", label: "Failed" },
}

function StatusIcon({ status }: { status: Status }) {
  if (status === "completed") return <Check className="h-3 w-3" />
  if (status === "skipped") return <SkipForward className="h-3 w-3" />
  return <X className="h-3 w-3" />
}

export function IrrigationLog() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between border-b border-[#e5e7eb] p-5">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-[#1a1f2e]">
            Recent Irrigation Events
          </h3>
          <p className="text-[12px] text-[#6b7280]">Last 72 hours across both zones</p>
        </div>
        <span className="rounded-full bg-[#f4f6f9] px-2 py-1 font-mono text-[11px] font-semibold text-[#1a1f2e]">
          {rows.length} events
        </span>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e5e7eb] bg-[#f8fafc] text-left text-[10.5px] font-semibold uppercase tracking-wider text-[#6b7280]">
              <th className="px-5 py-2.5">Time</th>
              <th className="px-3 py-2.5">Duration</th>
              <th className="px-3 py-2.5">Zone</th>
              <th className="px-3 py-2.5">Trigger</th>
              <th className="px-5 py-2.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="text-[12.5px]">
            {rows.map((r, i) => {
              const s = statusStyles[r.status]
              return (
                <tr
                  key={i}
                  className="border-b border-[#f1f5f9] transition-colors last:border-0 hover:bg-[#f8fafc]"
                >
                  <td className="px-5 py-3 font-mono text-[12px] text-[#1a1f2e]">{r.time}</td>
                  <td className="px-3 py-3 font-mono text-[12px] text-[#6b7280]">{r.duration}</td>
                  <td className="px-3 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
                        r.zone === "Zone A"
                          ? "bg-[#e8f5e9] text-[#2d7a3a]"
                          : "bg-[#fff4e0] text-[#b45309]",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          r.zone === "Zone A" ? "bg-[#3a9e4f]" : "bg-[#f59e0b]",
                        )}
                      />
                      {r.zone}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[#1a1f2e]">{r.trigger}</td>
                  <td className="px-5 py-3 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        s.bg,
                        s.text,
                      )}
                    >
                      <StatusIcon status={r.status} />
                      {s.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[#e5e7eb] px-5 py-3">
        <a
          href="/logs"
          className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#2d7a3a] hover:text-[#1a1f2e]"
        >
          View Full Logs
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}
