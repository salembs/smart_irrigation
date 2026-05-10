import type { LucideIcon } from "lucide-react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

type Tone = "green" | "orange" | "blue" | "slate"

const toneStyles: Record<Tone, { iconBg: string; iconColor: string }> = {
  green: { iconBg: "bg-[#e8f5e9]", iconColor: "text-[#2d7a3a]" },
  orange: { iconBg: "bg-[#fff4e0]", iconColor: "text-[#b45309]" },
  blue: { iconBg: "bg-[#e0f2fe]", iconColor: "text-[#0369a1]" },
  slate: { iconBg: "bg-[#eef2f6]", iconColor: "text-[#1a1f2e]" },
}

export function KpiCard({
  icon: Icon,
  label,
  value,
  unit,
  subtitle,
  tone = "slate",
  trend,
  pulsing = false,
}: {
  icon: LucideIcon
  label: string
  value: string
  unit?: string
  subtitle?: string
  tone?: Tone
  trend?: { direction: "up" | "down"; value: string }
  pulsing?: boolean
}) {
  const t = toneStyles[tone]

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            t.iconBg,
          )}
        >
          <Icon className={cn("h-5 w-5", t.iconColor)} strokeWidth={2} />
        </div>

        {trend && (
          <div
            className={cn(
              "flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
              trend.direction === "up"
                ? "bg-[#e8f5e9] text-[#2d7a3a]"
                : "bg-red-50 text-red-600",
            )}
          >
            {trend.direction === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend.value}
          </div>
        )}

        {pulsing && (
          <span className="relative flex h-2.5 w-2.5">
            <span className="pulse-dot absolute inline-flex h-full w-full rounded-full bg-[#3a9e4f] opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#3a9e4f]" />
          </span>
        )}
      </div>

      <div className="mt-5">
        <p className="text-[12px] font-medium uppercase tracking-wider text-[#6b7280]">
          {label}
        </p>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="font-mono text-[30px] font-bold leading-none tracking-tight text-[#1a1f2e]">
            {value}
          </span>
          {unit && (
            <span className="font-mono text-[14px] font-semibold text-[#6b7280]">
              {unit}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="mt-2 text-[12px] text-[#6b7280]">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
