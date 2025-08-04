"use client"

import { useEffect, useRef, useState } from "react"
import { useDashboard } from "@/contexts/dashboard-context"
import type { Polygon } from "@/types/polygon" // Import Polygon type

export function MapContainer() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [leaflet, setLeaflet] = useState<any>(null)
  const { polygons, addPolygon, isDrawing, setIsDrawing, dataSources, timeRange, fetchWeatherData, updatePolygon } =
    useDashboard()

  const [currentPolygon, setCurrentPolygon] = useState<[number, number][]>([])
  const [drawnPolygons, setDrawnPolygons] = useState<any[]>([])
  const [drawingMarkers, setDrawingMarkers] = useState<any[]>([])

  // Initialize map
  useEffect(() => {
    import("leaflet").then((L) => {
      setLeaflet(L)

      if (mapRef.current && !map) {
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "/placeholder.svg?height=25&width=25",
          iconUrl: "/placeholder.svg?height=25&width=25",
          shadowUrl: "/placeholder.svg?height=25&width=25",
        })

        const newMap = L.map(mapRef.current).setView([51.505, -0.09], 10)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(newMap)

        // Add reset view button
        const resetControl = L.control({ position: "topright" })
        resetControl.onAdd = () => {
          const div = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom")
          div.innerHTML =
            '<button style="background: white; border: none; padding: 5px 10px; cursor: pointer;">Reset View</button>'
          div.onclick = () => {
            newMap.setView([51.505, -0.09], 10)
          }
          return div
        }
        resetControl.addTo(newMap)

        setMap(newMap)
      }
    })
  }, [map])

  // Handle polygon drawing
  useEffect(() => {
    if (!map || !leaflet) return

    const handleMapClick = (e: any) => {
      if (!isDrawing) return

      const { lat, lng } = e.latlng
      const newPoint: [number, number] = [lat, lng]

      setCurrentPolygon((prev) => {
        const updated = [...prev, newPoint]

        // Add visual marker for the point
        const marker = leaflet
          .circleMarker([lat, lng], {
            radius: 5,
            fillColor: "#ff0000",
            color: "#ff0000",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          })
          .addTo(map)

        setDrawingMarkers((prevMarkers) => [...prevMarkers, marker])

        // Draw lines between points
        if (updated.length > 1) {
          const polyline = leaflet
            .polyline(updated, {
              color: "#ff0000",
              weight: 2,
              opacity: 0.7,
              dashArray: "5, 5",
            })
            .addTo(map)

          setDrawingMarkers((prevMarkers) => [...prevMarkers, polyline])
        }

        // Check for polygon completion
        if (updated.length >= 3) {
          const firstPoint = updated[0]
          const distance = map.distance([lat, lng], firstPoint)

          if (distance < 100 || updated.length >= 12) {
            completePolygon(updated)
            return []
          }
        }

        return updated
      })
    }

    const completePolygon = async (coordinates: [number, number][]) => {
      // Clear drawing markers
      drawingMarkers.forEach((marker) => map.removeLayer(marker))
      setDrawingMarkers([])

      // Create the polygon
      const polygon = leaflet
        .polygon(coordinates, {
          color: "#3b82f6",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.3,
        })
        .addTo(map)

      // Get the selected data source from sidebar
      const selectedDataSource = dataSources[0] // Default to first data source

      // Calculate polygon center (centroid)
      const bounds = polygon.getBounds()
      const center = bounds.getCenter()

      try {
        // Fetch weather data for polygon center
        const weatherData = await fetchWeatherData(center.lat, center.lng, timeRange.start, timeRange.end)

        let avgValue = 0
        if (weatherData.hourly && weatherData.hourly[selectedDataSource.field]) {
          const values = weatherData.hourly[selectedDataSource.field].filter((v: number) => v !== null && !isNaN(v))
          if (values.length > 0) {
            avgValue = values.reduce((a: number, b: number) => a + b, 0) / values.length
          }
        }

        const color = getColorForValue(avgValue, selectedDataSource.colorRules)
        polygon.setStyle({ fillColor: color, color: color })

        // Add to polygons state
        const newPolygon: Polygon = {
          id: Date.now().toString(),
          coordinates,
          dataSourceId: selectedDataSource.id,
          name: `Polygon ${polygons.length + 1}`,
          currentValue: avgValue,
          color: color,
        }

        addPolygon(newPolygon)
        setDrawnPolygons((prev) => [...prev, { polygon, data: newPolygon }])
      } catch (error) {
        console.error("Error processing polygon:", error)
        // Still add polygon with default values
        const newPolygon: Polygon = {
          id: Date.now().toString(),
          coordinates,
          dataSourceId: selectedDataSource.id,
          name: `Polygon ${polygons.length + 1}`,
        }
        addPolygon(newPolygon)
        setDrawnPolygons((prev) => [...prev, { polygon, data: newPolygon }])
      }

      setCurrentPolygon([])
      setIsDrawing(false)
    }

    map.on("click", handleMapClick)

    return () => {
      map.off("click", handleMapClick)
    }
  }, [map, leaflet, isDrawing, polygons.length, addPolygon, dataSources, timeRange, fetchWeatherData, drawingMarkers])

  // Update polygon colors when time changes
  useEffect(() => {
    if (!map || !leaflet || drawnPolygons.length === 0) return

    const updatePolygonColors = async () => {
      for (let i = 0; i < drawnPolygons.length; i++) {
        const { polygon, data } = drawnPolygons[i]
        const bounds = polygon.getBounds()
        const center = bounds.getCenter()

        const dataSource = dataSources.find((ds) => ds.id === data.dataSourceId)
        if (!dataSource) continue

        try {
          const weatherData = await fetchWeatherData(center.lat, center.lng, timeRange.start, timeRange.end)

          let avgValue = 0
          if (weatherData.hourly && weatherData.hourly[dataSource.field]) {
            const values = weatherData.hourly[dataSource.field].filter((v: number) => v !== null && !isNaN(v))
            if (values.length > 0) {
              avgValue = values.reduce((a: number, b: number) => a + b, 0) / values.length
            }
          }

          const color = getColorForValue(avgValue, dataSource.colorRules)
          polygon.setStyle({ fillColor: color, color: color })

          // Update polygon data
          updatePolygon(data.id, {
            currentValue: avgValue,
            color: color,
          })
        } catch (error) {
          console.error("Error updating polygon data:", error)
        }
      }
    }

    updatePolygonColors()
  }, [timeRange, drawnPolygons, fetchWeatherData, dataSources, updatePolygon])

  const getColorForValue = (value: number, rules: any[]) => {
    // Sort rules by value to apply them in correct order
    const sortedRules = [...rules].sort((a, b) => a.value - b.value)

    for (const rule of sortedRules) {
      switch (rule.operator) {
        case "<":
          if (value < rule.value) return rule.color
          break
        case "<=":
          if (value <= rule.value) return rule.color
          break
        case ">":
          if (value > rule.value) return rule.color
          break
        case ">=":
          if (value >= rule.value) return rule.color
          break
        case "=":
          if (Math.abs(value - rule.value) < 0.1) return rule.color
          break
      }
    }
    return "#3b82f6" // Default color
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      {isDrawing && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg border">
          <div className="text-sm font-medium text-green-600">🎯 Drawing Mode Active</div>
          <div className="text-xs text-muted-foreground mt-1">
            <div>• Points: {currentPolygon.length}/12</div>
            <div>• Min 3 points required</div>
            {currentPolygon.length >= 3 && <div>• Click near first point to close</div>}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border max-w-xs">
        <div className="text-sm font-medium mb-2">Legend</div>
        {dataSources.map((source) => (
          <div key={source.id} className="mb-2">
            <div className="text-xs font-medium">{source.name}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {source.colorRules.map((rule) => (
                <div key={rule.id} className="flex items-center gap-1 text-xs">
                  <div className="w-3 h-3 rounded border" style={{ backgroundColor: rule.color }} />
                  <span>
                    {rule.operator}
                    {rule.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
