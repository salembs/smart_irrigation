"use client"

import { useEffect, useState } from "react"
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye } from "lucide-react"

interface WeatherData {
  temp: number
  condition: string
  humidity: number
  windSpeed: number
  visibility: number
  feelsLike: number
  icon: string
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Sfax Olive Zone, Tunisia coordinates: 35.2883° N, 10.7597° E
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=35.2883&longitude=10.7597&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,visibility,apparent_temperature&timezone=Africa/Tunis`
        )
        const data = await response.json()
        const current = data.current

        // Map WMO weather codes to conditions
        const getWeatherCondition = (code: number) => {
          if (code === 0) return "Clear"
          if (code === 1 || code === 2) return "Mostly Clear"
          if (code === 3) return "Overcast"
          if ([45, 48].includes(code)) return "Foggy"
          if ([51, 53, 55].includes(code)) return "Drizzle"
          if ([61, 63, 65].includes(code)) return "Rain"
          if ([80, 81, 82].includes(code)) return "Showers"
          if ([85, 86].includes(code)) return "Heavy Snow"
          return "Cloudy"
        }

        setWeather({
          temp: Math.round(current.temperature_2m),
          condition: getWeatherCondition(current.weather_code),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          visibility: Math.round(current.visibility / 1000),
          feelsLike: Math.round(current.apparent_temperature),
          icon: current.weather_code,
        })
      } catch (error) {
        console.log("[v0] Weather fetch error, using fallback")
        setWeather({
          temp: 26,
          condition: "Sunny",
          humidity: 55,
          windSpeed: 8,
          visibility: 10,
          feelsLike: 26,
          icon: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 600000) // Refresh every 10 minutes
    return () => clearInterval(interval)
  }, [])

  if (loading || !weather) {
    return (
      <div className="animate-pulse rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
        <div className="h-4 w-20 rounded bg-[#e5e7eb]" />
      </div>
    )
  }

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="h-10 w-10 text-[#f59e0b]" />
    if ([1, 2].includes(code)) return <Cloud className="h-10 w-10 text-[#9ca3af]" />
    if ([61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className="h-10 w-10 text-[#3b82f6]" />
    return <Cloud className="h-10 w-10 text-[#9ca3af]" />
  }

  return (
    <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <h3 className="mb-4 text-[15px] font-semibold tracking-tight text-[#1a1f2e]">
        Current Weather · Sfax
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Main temp card */}
        <div className="flex items-center gap-4 rounded-lg border border-[#e5e7eb] bg-gradient-to-br from-[#f9fafb] to-white p-4">
          <div>{getWeatherIcon(weather.icon)}</div>
          <div>
            <div className="font-mono text-[28px] font-bold text-[#1a1f2e]">
              {weather.temp}°
            </div>
            <p className="text-[12px] font-medium text-[#6b7280]">{weather.condition}</p>
            <p className="text-[11px] text-[#9ca3af]">Feels {weather.feelsLike}°</p>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-[#f3f4f6] p-3">
            <Droplets className="h-4 w-4 text-[#3b82f6]" />
            <div>
              <p className="text-[10px] font-semibold uppercase text-[#6b7280]">Humidity</p>
              <p className="font-mono text-[13px] font-bold text-[#1a1f2e]">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-[#f3f4f6] p-3">
            <Wind className="h-4 w-4 text-[#6b7280]" />
            <div>
              <p className="text-[10px] font-semibold uppercase text-[#6b7280]">Wind</p>
              <p className="font-mono text-[13px] font-bold text-[#1a1f2e]">{weather.windSpeed} km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-[#f3f4f6] p-3">
            <Eye className="h-4 w-4 text-[#8b5cf6]" />
            <div>
              <p className="text-[10px] font-semibold uppercase text-[#6b7280]">Visibility</p>
              <p className="font-mono text-[13px] font-bold text-[#1a1f2e]">{weather.visibility} km</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
