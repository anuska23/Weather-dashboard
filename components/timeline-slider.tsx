"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useDashboard } from "@/contexts/dashboard-context"

export function TimelineSlider() {
  const { timeRange, setTimeRange } = useDashboard()
  const [sliderMode, setSliderMode] = useState<"single" | "range">("single")
  const [currentHour, setCurrentHour] = useState(360) // Start at center (15 days * 24 hours)
  const [rangeStart, setRangeStart] = useState(336) // 14 days from start
  const [rangeEnd, setRangeEnd] = useState(384) // 16 days from start

  // Generate 30 days of hourly data (15 days before and after today)
  const totalHours = 30 * 24 // 720 hours
  const centerHour = totalHours / 2 // Current time position

  useEffect(() => {
    const now = new Date()
    const startDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)

    if (sliderMode === "single") {
      const selectedDate = new Date(startDate.getTime() + currentHour * 60 * 60 * 1000)
      setTimeRange({
        start: selectedDate,
        end: selectedDate,
        mode: "single",
      })
    } else {
      const startSelected = new Date(startDate.getTime() + rangeStart * 60 * 60 * 1000)
      const endSelected = new Date(startDate.getTime() + rangeEnd * 60 * 60 * 1000)
      setTimeRange({
        start: startSelected,
        end: endSelected,
        mode: "range",
      })
    }
  }, [sliderMode, currentHour, rangeStart, rangeEnd, setTimeRange])

  const formatDate = (hourOffset: number) => {
    const now = new Date()
    const startDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
    const targetDate = new Date(startDate.getTime() + hourOffset * 60 * 60 * 1000)

    const isToday = targetDate.toDateString() === now.toDateString()
    const dateStr = isToday ? "Today" : targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const timeStr = targetDate.getHours().toString().padStart(2, "0") + ":00"

    return `${dateStr} ${timeStr}`
  }

  const formatDuration = (hours: number) => {
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24

    if (days === 0) {
      return `${remainingHours}h`
    } else if (remainingHours === 0) {
      return `${days}d`
    } else {
      return `${days}d ${remainingHours}h`
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Timeline Control</h3>
            <p className="text-sm text-muted-foreground">30-day window with hourly resolution</p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={sliderMode === "single" ? "default" : "outline"}
              onClick={() => setSliderMode("single")}
            >
              Single Point
            </Button>
            <Button
              size="sm"
              variant={sliderMode === "range" ? "default" : "outline"}
              onClick={() => setSliderMode("range")}
            >
              Time Range
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>15 days ago</span>
            <span className="font-medium">Today</span>
            <span>15 days from now</span>
          </div>

          {sliderMode === "single" ? (
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={totalHours - 1}
                  value={currentHour}
                  onChange={(e) => setCurrentHour(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                {/* Today marker */}
                <div
                  className="absolute top-0 w-0.5 h-2 bg-red-500"
                  style={{ left: `${(centerHour / totalHours) * 100}%` }}
                />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{formatDate(currentHour)}</div>
                <div className="text-xs text-muted-foreground">
                  {currentHour < centerHour
                    ? `${Math.round(((centerHour - currentHour) / 24) * 10) / 10} days ago`
                    : currentHour > centerHour
                      ? `${Math.round(((currentHour - centerHour) / 24) * 10) / 10} days from now`
                      : "Current time"}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                {/* Range track */}
                <div className="w-full h-2 bg-gray-200 rounded-lg relative">
                  <div
                    className="absolute h-2 bg-blue-500 rounded"
                    style={{
                      left: `${(rangeStart / totalHours) * 100}%`,
                      width: `${((rangeEnd - rangeStart) / totalHours) * 100}%`,
                    }}
                  />
                </div>

                {/* Start handle */}
                <input
                  type="range"
                  min="0"
                  max={totalHours - 1}
                  value={rangeStart}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    if (value < rangeEnd - 1) {
                      // Minimum 1 hour range
                      setRangeStart(value)
                    }
                  }}
                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                />

                {/* End handle */}
                <input
                  type="range"
                  min="0"
                  max={totalHours - 1}
                  value={rangeEnd}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    if (value > rangeStart + 1) {
                      // Minimum 1 hour range
                      setRangeEnd(value)
                    }
                  }}
                  className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider"
                />

                {/* Today marker */}
                <div
                  className="absolute top-0 w-0.5 h-2 bg-red-500 pointer-events-none"
                  style={{ left: `${(centerHour / totalHours) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Start: {formatDate(rangeStart)}</div>
                </div>
                <div>
                  <div className="font-medium">End: {formatDate(rangeEnd)}</div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm font-medium">Duration: {formatDuration(rangeEnd - rangeStart)}</div>
                <div className="text-xs text-muted-foreground">{rangeEnd - rangeStart} hours selected</div>
              </div>
            </div>
          )}
        </div>

        {/* Quick time selection buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (sliderMode === "single") {
                setCurrentHour(centerHour)
              } else {
                setRangeStart(centerHour - 12)
                setRangeEnd(centerHour + 12)
              }
            }}
          >
            Now
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (sliderMode === "single") {
                setCurrentHour(centerHour - 24)
              } else {
                setRangeStart(centerHour - 36)
                setRangeEnd(centerHour - 12)
              }
            }}
          >
            Yesterday
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (sliderMode === "single") {
                setCurrentHour(centerHour - 168) // 7 days
              } else {
                setRangeStart(centerHour - 180)
                setRangeEnd(centerHour - 156)
              }
            }}
          >
            Last Week
          </Button>
        </div>
      </div>
    </Card>
  )
}
