"use client"

import { useEffect, useState } from "react"
import { Sprout, Thermometer, CloudRain, Droplets } from "lucide-react"
import { AppShell } from "@/components/irrisense/app-shell"
import { KpiCard } from "@/components/irrisense/kpi-card"
import { FieldMap } from "@/components/irrisense/field-map"
import { SystemHealth } from "@/components/irrisense/system-health"
import { MoistureChart } from "@/components/irrisense/moisture-chart"
import { IrrigationLog } from "@/components/irrisense/irrigation-log"
import { ZoneCard } from "@/components/irrisense/zone-card"
import { ThresholdSettings } from "@/components/irrisense/threshold-settings"
import { WeatherWidget } from "@/components/irrisense/weather-widget"
import { useIrrigationData } from "@/hooks/use-irrigation-data"

interface WeatherData {
  temperature: number
  humidity: number
  description: string
}

export default function DashboardPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [sliderDuration, setSliderDuration] = useState<number>(20)
  const { data: irrigationData, loading, error, updateCommand, stopIrrigation } = useIrrigationData()

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=35.2883&longitude=10.7597&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Africa/Tunis`
        )
        const data = await response.json()
        const current = data.current

        setWeather({
          temperature: current.temperature_2m,
          humidity: current.relative_humidity_2m,
          description: `${current.temperature_2m}°C`,
        })
      } catch (error) {
        console.error("[v0] Weather fetch error:", error)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 600000) // Refresh every 10 minutes

    return () => clearInterval(interval)
  }, [])

  const soilTemp = weather?.temperature ?? 24.3
  const tempTrend = soilTemp > 25 ? { direction: "up" as const, value: "+0.8°" } : { direction: "down" as const, value: "-0.4°" }

  return (
    <AppShell title="Dashboard Overview">
      <div className="space-y-10">
        {/* ─────────────────── DASHBOARD ─────────────────── */}
        <section id="dashboard" className="scroll-mt-24 space-y-6">
          <SectionHeader
            eyebrow="01 · Overview"
            title="Dashboard Overview"
            description="Live telemetry from the LoRa mesh across the Sfax olive farm. Master node in field, slave node in control room. Readings refresh every 30 seconds."
          />

          {/* KPI cards */}
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            aria-label="Key metrics"
          >
            <KpiCard
              icon={Sprout}
              label="Soil Moisture"
              value={irrigationData?.soil_moisture === 1 ? "HIGH" : "LOW"}
              subtitle={irrigationData?.soil_moisture === 1 ? "Soil has sufficient moisture" : "Soil needs irrigation"}
              tone={irrigationData?.soil_moisture === 1 ? "green" : "orange"}
            />
            <KpiCard
              icon={Thermometer}
              label="Air Temperature"
              value={soilTemp.toFixed(1)}
              unit="°C"
              subtitle="From weather data · Sfax zone"
              tone="orange"
              trend={tempTrend}
            />
            <KpiCard
              icon={CloudRain}
              label="Rain Sensor"
              value={irrigationData?.rain === 1 ? "RAIN" : "DRY"}
              subtitle={irrigationData?.rain === 1 ? "Rain detected" : "No rain · Dry conditions"}
              tone={irrigationData?.rain === 1 ? "blue" : "slate"}
            />
            <KpiCard
              icon={Droplets}
              label="Pump Status"
              value={irrigationData?.command === 1 ? "RUNNING" : "IDLE"}
              subtitle={irrigationData?.command === 1 ? `Duration: ${irrigationData?.duration} min` : "Ready to start"}
              tone={irrigationData?.command === 1 ? "green" : "slate"}
              pulsing={irrigationData?.command === 1}
            />
          </div>
        </section>

        {/* ─────────────────── FIELD MAP ─────────────────── */}
        <section id="field-map" className="scroll-mt-24 space-y-6">
          <SectionHeader
            eyebrow="02 · Field Map"
            title="Field Map & System Health"
            description="Interactive map showing master node in the olive field and slave node in the control room, alongside real-time system status and current weather."
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <FieldMap />
            </div>
            <div className="flex flex-col gap-4">
              <WeatherWidget />
              <SystemHealth />
            </div>
          </div>
        </section>

        {/* ─────────────────── SENSOR DATA ─────────────────── */}
        <section id="sensors" className="scroll-mt-24 space-y-6">
          <SectionHeader
            eyebrow="03 · Sensor Data"
            title="Sensor Trends & Irrigation History"
            description="Soil moisture vs. temperature across the last 12 hours, plus a rolling log of pump events."
          />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <MoistureChart />
            </div>
            <div className="xl:col-span-2">
              <IrrigationLog />
            </div>
          </div>
        </section>

        {/* ─────────────────── IRRIGATION CONTROL ─────────────────── */}
        <section id="irrigation" className="scroll-mt-24 space-y-6">
          <SectionHeader
            eyebrow="04 · Irrigation Control"
            title="Farm Pump Control"
            description="Manually engage the pump, adjust run duration, and monitor live soil moisture. All commands are relayed via LoRa to the slave node gateway in the control room."
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2" aria-label="Farm irrigation control">
            <ZoneCard
              name="Olive Farm"
              sector="Sfax Field Zone"
              area="3.2 ha"
              data={irrigationData}
              onCommand={updateCommand}
              onStop={stopIrrigation}
              loading={loading}
              duration={sliderDuration}
              onDurationChange={setSliderDuration}
            />
          </div>
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              Error: {error}
            </div>
          )}
        </section>

        {/* ─────────────────── AUTOMATION ─────────────────── */}
        <section id="automation" className="scroll-mt-24 space-y-6 pb-8">
          <SectionHeader
            eyebrow="05 · Automation"
            title="Thresholds & Scheduling"
            description="Auto mode activates the pump when temperature exceeds 30°C, or when no rain is detected and soil moisture is low."
          />
          <ThresholdSettings
            soilMoisture={irrigationData?.soil_moisture ?? 0}
            rain={irrigationData?.rain ?? 0}
            temperature={Math.round(weather?.temperature ?? 25)}
            duration={sliderDuration}
            onAutoCommand={(shouldPump) => {
              if (irrigationData) {
                const newCommand = shouldPump ? 1 : 0
                if (newCommand !== irrigationData.command) {
                  updateCommand(newCommand, shouldPump ? sliderDuration : 0)
                }
              }
            }}
          />
        </section>
      </div>
    </AppShell>
  )
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#e5e7eb] pb-4">
      <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#4CAF50]">
        {eyebrow}
      </span>
      <h2 className="text-[20px] font-semibold tracking-tight text-[#1a1f2e]">{title}</h2>
      <p className="max-w-3xl text-[13px] leading-relaxed text-[#6b7280]">{description}</p>
    </div>
  )
}
