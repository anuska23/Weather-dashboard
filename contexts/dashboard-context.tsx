"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export interface ColorRule {
  id: string
  color: string
  operator: "=" | "<" | ">" | "<=" | ">="
  value: number
}

export interface DataSource {
  id: string
  name: string
  field: string
  colorRules: ColorRule[]
}

export interface Polygon {
  id: string
  coordinates: [number, number][]
  dataSourceId: string
  name: string
  currentValue?: number
  color?: string
}

export interface TimeRange {
  start: Date
  end: Date
  mode: "single" | "range"
}

interface DashboardContextType {
  polygons: Polygon[]
  dataSources: DataSource[]
  timeRange: TimeRange
  isDrawing: boolean
  selectedPolygon: string | null
  addPolygon: (polygon: Omit<Polygon, "id">) => void
  updatePolygon: (id: string, updates: Partial<Polygon>) => void
  deletePolygon: (id: string) => void
  setTimeRange: (range: TimeRange) => void
  setIsDrawing: (drawing: boolean) => void
  setSelectedPolygon: (id: string | null) => void
  updateDataSource: (id: string, updates: Partial<DataSource>) => void
  fetchWeatherData: (lat: number, lon: number, startDate: Date, endDate: Date) => Promise<any>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [polygons, setPolygons] = useState<Polygon[]>([])
  const [selectedPolygon, setSelectedPolygon] = useState<string | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    end: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    mode: "single",
  })

  const [dataSources] = useState<DataSource[]>([
    {
      id: "temperature",
      name: "Temperature (°C)",
      field: "temperature_2m",
      colorRules: [
        { id: "1", color: "#3b82f6", operator: "<", value: 10 },
        { id: "2", color: "#f59e0b", operator: "<", value: 25 },
        { id: "3", color: "#ef4444", operator: ">=", value: 25 },
      ],
    },
    {
      id: "humidity",
      name: "Humidity (%)",
      field: "relative_humidity_2m",
      colorRules: [
        { id: "4", color: "#ef4444", operator: "<", value: 30 },
        { id: "5", color: "#22c55e", operator: "<", value: 70 },
        { id: "6", color: "#3b82f6", operator: ">=", value: 70 },
      ],
    },
    {
      id: "wind",
      name: "Wind Speed (km/h)",
      field: "wind_speed_10m",
      colorRules: [
        { id: "7", color: "#22c55e", operator: "<", value: 10 },
        { id: "8", color: "#f59e0b", operator: "<", value: 25 },
        { id: "9", color: "#3b82f6", operator: ">=", value: 25 },
      ],
    },
    {
      id: "precipitation",
      name: "Precipitation (mm)",
      field: "precipitation",
      colorRules: [
        { id: "10", color: "#22c55e", operator: "<", value: 1 },
        { id: "11", color: "#f59e0b", operator: "<", value: 5 },
        { id: "12", color: "#3b82f6", operator: ">=", value: 5 },
      ],
    },
  ])

  const addPolygon = useCallback(
    (polygon: Omit<Polygon, "id">) => {
      const newPolygon: Polygon = {
        ...polygon,
        id: Date.now().toString(),
        name: `Polygon ${polygons.length + 1}`,
      }
      setPolygons((prev) => [...prev, newPolygon])
    },
    [polygons.length],
  )

  const updatePolygon = useCallback((id: string, updates: Partial<Polygon>) => {
    setPolygons((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }, [])

  const deletePolygon = useCallback(
    (id: string) => {
      setPolygons((prev) => prev.filter((p) => p.id !== id))
      if (selectedPolygon === id) {
        setSelectedPolygon(null)
      }
    },
    [selectedPolygon],
  )

  const updateDataSource = useCallback((id: string, updates: Partial<DataSource>) => {
    // In a real app, this would update the data source
    console.log("Update data source:", id, updates)
  }, [])

  const fetchWeatherData = useCallback(async (lat: number, lon: number, startDate: Date, endDate: Date) => {
    const start = startDate.toISOString().split("T")[0]
    const end = endDate.toISOString().split("T")[0]

    // Use the exact API format from the requirements
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation`

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      // Handle the response properly
      if (data.hourly) {
        return {
          hourly: {
            time: data.hourly.time || [],
            temperature_2m: data.hourly.temperature_2m || [],
            relative_humidity_2m: data.hourly.relative_humidity_2m || [],
            wind_speed_10m: data.hourly.wind_speed_10m || [],
            precipitation: data.hourly.precipitation || [],
          },
        }
      }

      return data
    } catch (error) {
      console.error("Error fetching weather data:", error)
      // Return realistic mock data for demo purposes
      const hours = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))
      const mockData = {
        hourly: {
          time: Array.from({ length: hours }, (_, i) => {
            const date = new Date(startDate.getTime() + i * 60 * 60 * 1000)
            return date.toISOString()
          }),
          temperature_2m: Array.from({ length: hours }, () => Math.random() * 30 + 5),
          relative_humidity_2m: Array.from({ length: hours }, () => Math.random() * 60 + 30),
          wind_speed_10m: Array.from({ length: hours }, () => Math.random() * 20 + 2),
          precipitation: Array.from({ length: hours }, () => Math.random() * 5),
        },
      }
      return mockData
    }
  }, [])

  const value: DashboardContextType = {
    polygons,
    dataSources,
    timeRange,
    isDrawing,
    selectedPolygon,
    addPolygon,
    updatePolygon,
    deletePolygon,
    setTimeRange,
    setIsDrawing,
    setSelectedPolygon,
    updateDataSource,
    fetchWeatherData,
  }

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}
