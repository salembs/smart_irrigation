"use client"

import { useState, useEffect } from "react"
import { Sparkles, CloudRain, Thermometer, Droplets, CloudOff } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface ThresholdSettingsProps {
  soilMoisture: number // 0 = low, 1 = high
  rain: number // 0 = no rain, 1 = raining
  temperature: number // current temperature in celsius
  duration: number // duration in minutes from the control
  onAutoCommand?: (shouldPump: boolean) => void
}

export function ThresholdSettings({ 
  soilMoisture, 
  rain, 
  temperature,
  duration,
  onAutoCommand 
}: ThresholdSettingsProps) {
  const [auto, setAuto] = useState(false)

  // Auto mode logic: pump ON if temperature > 30 OR (no rain AND low soil moisture)
  const shouldPump = temperature > 30 || (rain === 0 && soilMoisture === 0)

  useEffect(() => {
    if (auto && onAutoCommand) {
      onAutoCommand(shouldPump)
    }
  }, [auto, shouldPump, onAutoCommand])

  const isHighTemp = temperature > 30
  const isNoRain = rain === 0
  const isLowMoisture = soilMoisture === 0

  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-[#1a1f2e]">
            Automation Settings
          </h3>
          <p className="text-[12px] text-[#6b7280]">
            Automatic pump control based on sensor readings
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f5e9] px-2 py-1 text-[10.5px] font-semibold text-[#2d7a3a]">
          <Sparkles className="h-3 w-3" />
          SMART
        </span>
      </div>

      {/* Conditions display */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Temperature condition */}
        <div className={`flex items-center gap-3 rounded-lg border p-3 ${
          isHighTemp 
            ? "border-[#ef4444]/30 bg-[#fef2f2]" 
            : "border-[#e5e7eb] bg-[#f9fafb]"
        }`}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
            isHighTemp ? "bg-[#ef4444] text-white" : "bg-[#f3f4f6] text-[#6b7280]"
          }`}>
            <Thermometer className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#6b7280]">Temperature</p>
            <p className={`font-mono text-[14px] font-bold ${
              isHighTemp ? "text-[#ef4444]" : "text-[#1a1f2e]"
            }`}>
              {temperature}°C {isHighTemp && "> 30°C"}
            </p>
          </div>
        </div>

        {/* Rain condition */}
        <div className={`flex items-center gap-3 rounded-lg border p-3 ${
          isNoRain 
            ? "border-[#f59e0b]/30 bg-[#fffbeb]" 
            : "border-[#3b82f6]/30 bg-[#eff6ff]"
        }`}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
            isNoRain ? "bg-[#f59e0b] text-white" : "bg-[#3b82f6] text-white"
          }`}>
            {isNoRain ? <CloudOff className="h-4 w-4" /> : <CloudRain className="h-4 w-4" />}
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#6b7280]">Rain Sensor</p>
            <p className={`font-mono text-[14px] font-bold ${
              isNoRain ? "text-[#f59e0b]" : "text-[#3b82f6]"
            }`}>
              {isNoRain ? "No Rain" : "Raining"}
            </p>
          </div>
        </div>

        {/* Soil moisture condition */}
        <div className={`flex items-center gap-3 rounded-lg border p-3 ${
          isLowMoisture 
            ? "border-[#ef4444]/30 bg-[#fef2f2]" 
            : "border-[#22c55e]/30 bg-[#f0fdf4]"
        }`}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
            isLowMoisture ? "bg-[#ef4444] text-white" : "bg-[#22c55e] text-white"
          }`}>
            <Droplets className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-[#6b7280]">Soil Moisture</p>
            <p className={`font-mono text-[14px] font-bold ${
              isLowMoisture ? "text-[#ef4444]" : "text-[#22c55e]"
            }`}>
              {isLowMoisture ? "Low" : "High"}
            </p>
          </div>
        </div>
      </div>

      {/* Auto mode status */}
      {auto && (
        <div className={`mb-4 rounded-lg border p-3 ${
          shouldPump 
            ? "border-[#22c55e]/30 bg-[#f0fdf4]" 
            : "border-[#6b7280]/20 bg-[#f9fafb]"
        }`}>
          <p className="text-[12px] font-medium text-[#1a1f2e]">
            Auto Decision: <span className={`font-bold ${shouldPump ? "text-[#22c55e]" : "text-[#6b7280]"}`}>
              {shouldPump ? `PUMP ON (${duration} min)` : "PUMP OFF"}
            </span>
          </p>
          <p className="mt-1 text-[11px] text-[#6b7280]">
            {isHighTemp 
              ? `Temperature exceeds 30°C - irrigation needed for ${duration} minutes` 
              : shouldPump 
                ? `No rain detected and soil moisture is low - running for ${duration} minutes` 
                : "Conditions do not require irrigation"}
          </p>
        </div>
      )}

      {/* Auto mode toggle */}
      <div className="flex items-start justify-between gap-4 rounded-lg border border-[#3a9e4f]/20 bg-gradient-to-br from-[#e8f5e9] to-white p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#3a9e4f] text-white">
            <CloudRain className="h-[18px] w-[18px]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-semibold text-[#1a1f2e]">Auto Mode</p>
              <span className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                auto 
                  ? "bg-[#22c55e] text-white" 
                  : "bg-white text-[#6b7280]"
              }`}>
                {auto ? "ON" : "OFF"}
              </span>
            </div>
            <p className="mt-0.5 max-w-[560px] text-pretty text-[12px] text-[#475569]">
              Pump activates automatically when temperature exceeds 30°C, or when no rain is detected and soil moisture is low.
            </p>
          </div>
        </div>
        <Switch
          checked={auto}
          onCheckedChange={setAuto}
          className="data-[state=checked]:bg-[#3a9e4f]"
          aria-label="Toggle auto mode"
        />
      </div>
    </div>
  )
}
