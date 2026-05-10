"use client"

import { useState } from "react"
import { Play, MapPin, Gauge, AlertCircle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import type { IrrigationData } from "@/hooks/use-irrigation-data"

export function ZoneCard({
  name,
  sector,
  area,
  data,
  onCommand,
  onStop,
  loading = false,
  duration,
  onDurationChange,
}: {
  name: string
  sector: string
  area: string
  data: IrrigationData | null
  onCommand: (command: number, duration: number) => Promise<void>
  onStop: () => Promise<void>
  loading?: boolean
  duration: number
  onDurationChange: (duration: number) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const isPumpRunning = data?.command === 1
  const moistureStatus = data?.soil_moisture === 1 ? "HIGH" : "LOW"
  const moistureValue = data?.soil_moisture === 1 ? 75 : 30
  const statusBadge = isPumpRunning ? "● RUNNING" : "IDLE"

  const handleRunNow = async () => {
    console.log('[v0] handleRunNow called with duration:', duration)
    setIsSubmitting(true)
    setFeedback(null)
    try {
      console.log('[v0] Calling onCommand(1, ' + duration + ')')
      await onCommand(1, duration)
      console.log('[v0] Command executed successfully')
      setFeedback({ type: 'success', message: 'Pump started successfully' })
      setTimeout(() => setFeedback(null), 3000)
    } catch (err) {
      console.error('[v0] Error in handleRunNow:', err)
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Failed to start pump' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStop = async () => {
    setIsSubmitting(true)
    setFeedback(null)
    try {
      await onStop()
      setFeedback({ type: 'success', message: 'Irrigation stopped - soil marked as irrigated' })
      setTimeout(() => setFeedback(null), 3000)
    } catch (err) {
      console.error('[v0] Error in handleStop:', err)
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Failed to stop pump' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const accentBar = "bg-gradient-to-r from-[#3a9e4f] to-[#4CAF50]"
  const accentDot = "bg-[#3a9e4f]"
  const accentBg = "bg-[#e8f5e9]"
  // HIGH (1) = sufficient moisture = green (good), LOW (0) = needs irrigation = red (warning)
  const moistureColor = data?.soil_moisture === 1 ? "text-green-600" : "text-red-600"

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className={cn("h-1 w-full", accentBar)} />

      <div className="space-y-5 p-5">
        {/* Feedback message */}
        {feedback && (
          <div
            className={cn(
              "rounded-lg p-3 text-[12px] font-medium",
              feedback.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            )}
          >
            {feedback.message}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", accentDot)} />
              <h3 className="text-[17px] font-semibold tracking-tight text-[#1a1f2e]">
                {name}
              </h3>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10.5px] font-semibold",
                  isPumpRunning ? "bg-[#e8f5e9] text-[#2d7a3a]" : "bg-[#eef2f6] text-[#475569]",
                )}
              >
                {statusBadge}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-3 text-[12px] text-[#6b7280]">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {sector}
              </span>
              <span className="inline-flex items-center gap-1">
                <Gauge className="h-3 w-3" />
                {area}
              </span>
            </div>
          </div>

          <div className={cn("rounded-lg px-3 py-2 text-center", accentBg)}>
            <div className={cn("font-mono text-[22px] font-bold leading-none", moistureColor)}>
              {moistureStatus}
            </div>
            <div className={cn("mt-1 text-[10px] font-semibold uppercase tracking-wider", moistureColor)}>
              Soil Moisture
            </div>
          </div>
        </div>

        {/* Soil moisture status indicator */}
        <div className="rounded-lg border border-[#e5e7eb] bg-[#f8fafc] p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className={cn("h-4 w-4", moistureColor)} strokeWidth={2.5} />
              <div>
                <p className="text-[12px] font-semibold text-[#1a1f2e]">Soil Moisture Status</p>
                <p className="text-[11px] text-[#6b7280]">
                  {data?.soil_moisture === 1
                    ? "Soil has sufficient moisture"
                    : "Soil needs irrigation"}
                </p>
              </div>
            </div>
            <div
              className={cn(
                "h-3 w-3 rounded-full",
                data?.soil_moisture === 1 ? "bg-green-500" : "bg-red-500",
              )}
            />
          </div>
        </div>

        {/* Pump status & control */}
        <div className="rounded-lg border border-[#e5e7eb] bg-[#f8fafc] p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[#1a1f2e]">Pump Status</p>
              <p className="text-[11.5px] text-[#6b7280]">
                {isPumpRunning ? "Currently running..." : "Ready to start"}
              </p>
            </div>
            <div
              className={cn(
                "h-3 w-3 rounded-full",
                isPumpRunning ? "bg-[#3a9e4f]" : "bg-[#cbd5e1]",
              )}
            />
          </div>
        </div>

        {/* Duration slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[13px] font-semibold text-[#1a1f2e]">
              Run Duration
            </label>
            <span className="font-mono text-[13px] font-bold text-[#1a1f2e]">
              {duration} min
            </span>
          </div>
          <Slider
            value={[duration]}
            onValueChange={(val) => onDurationChange(val[0])}
            min={5}
            max={60}
            step={1}
            disabled={isSubmitting || loading}
            aria-label="Run duration in minutes"
          />
          <div className="mt-1.5 flex justify-between font-mono text-[10px] text-[#6b7280]">
            <span>5 min</span>
            <span>60 min</span>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleRunNow}
            disabled={isSubmitting || loading || isPumpRunning}
            type="button"
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-transform active:scale-[0.98] disabled:opacity-50",
              "bg-[#3a9e4f] hover:bg-[#2d7a3a]",
            )}
          >
            <Play className="h-4 w-4 fill-current" />
            {isSubmitting ? "Starting..." : `Run Now · ${duration} min`}
          </button>
          {isPumpRunning && (
            <button
              onClick={handleStop}
              disabled={isSubmitting || loading}
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-transform hover:bg-red-600 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? "Stopping..." : "Stop"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
