"use client"

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// 12 hours of hourly readings
const data = [
  { t: "06:00", moisture: 58, temp: 18.2 },
  { t: "07:00", moisture: 57, temp: 19.1 },
  { t: "08:00", moisture: 56, temp: 20.4 },
  { t: "09:00", moisture: 54, temp: 22.0 },
  { t: "10:00", moisture: 52, temp: 23.2 },
  { t: "11:00", moisture: 66, temp: 24.0 },
  { t: "12:00", moisture: 71, temp: 25.1 },
  { t: "13:00", moisture: 69, temp: 25.8 },
  { t: "14:00", moisture: 66, temp: 26.2 },
  { t: "15:00", moisture: 64, temp: 25.6 },
  { t: "16:00", moisture: 63, temp: 24.9 },
  { t: "17:00", moisture: 62, temp: 24.3 },
]

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-[#e5e7eb] bg-white p-2.5 shadow-md">
      <div className="mb-1 font-mono text-[11px] font-semibold text-[#6b7280]">
        {label}
      </div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-[12px]">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-[#6b7280]">{p.name}</span>
          <span className="ml-auto font-mono font-semibold text-[#1a1f2e]">
            {p.value}
            {p.name === "Moisture" ? "%" : "°C"}
          </span>
        </div>
      ))}
    </div>
  )
}

export function MoistureChart() {
  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-[#1a1f2e]">
            Sensor Readings — Last 12 Hours
          </h3>
          <p className="text-[12px] text-[#6b7280]">
            Moisture from soil sensor @ 20cm depth · Temperature from weather data
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-4 rounded-sm bg-[#3a9e4f]" />
            <span className="font-medium text-[#1a1f2e]">Moisture %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="h-0 w-4 border-t-2 border-dashed"
              style={{ borderColor: "#f59e0b" }}
            />
            <span className="font-medium text-[#1a1f2e]">Temp °C</span>
          </div>
        </div>
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="moistFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3a9e4f" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3a9e4f" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#eef2f6" vertical={false} />
            <XAxis
              dataKey="t"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              style={{ fontFamily: "var(--font-mono)" }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              style={{ fontFamily: "var(--font-mono)" }}
            />

            {/* Shaded optimal region */}
            <ReferenceArea
              y1={55}
              y2={75}
              fill="#3a9e4f"
              fillOpacity={0.06}
              stroke="none"
            />
            <ReferenceLine
              y={55}
              stroke="#3a9e4f"
              strokeDasharray="4 4"
              label={{
                value: "Min 55%",
                position: "insideBottomRight",
                fill: "#2d7a3a",
                fontSize: 10,
                fontWeight: 600,
              }}
            />
            <ReferenceLine
              y={75}
              stroke="#3a9e4f"
              strokeDasharray="4 4"
              label={{
                value: "Max 75%",
                position: "insideTopRight",
                fill: "#2d7a3a",
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#cbd5e1", strokeDasharray: 3 }} />

            <Area
              name="Moisture"
              type="monotone"
              dataKey="moisture"
              stroke="#3a9e4f"
              strokeWidth={2.25}
              fill="url(#moistFill)"
              dot={false}
              activeDot={{ r: 4, fill: "#3a9e4f", stroke: "#fff", strokeWidth: 2 }}
            />
            <Line
              name="Temp"
              type="monotone"
              dataKey="temp"
              stroke="#f59e0b"
              strokeWidth={1.75}
              strokeDasharray="5 4"
              dot={false}
              activeDot={{ r: 3.5, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
