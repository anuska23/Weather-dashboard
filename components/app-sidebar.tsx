"use client"

import { useState } from "react"
import { Plus, Trash2, GripVertical } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "@/contexts/dashboard-context"

export function AppSidebar() {
  const { polygons, dataSources, deletePolygon, updatePolygon, setIsDrawing, isDrawing, updateDataSource } =
    useDashboard()
  const [selectedDataSource, setSelectedDataSource] = useState(dataSources[0]?.id || "temperature")

  return (
    <Sidebar className="w-80">
      <SidebarHeader>
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold">Weather Dashboard</h2>
          <p className="text-sm text-muted-foreground">Interactive weather data visualization</p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Drawing Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2">
              <Button
                onClick={() => setIsDrawing(!isDrawing)}
                variant={isDrawing ? "destructive" : "default"}
                className="w-full"
              >
                {isDrawing ? "Cancel Drawing" : "Draw Polygon"}
              </Button>

              {isDrawing && (
                <div className="p-2 bg-muted rounded text-xs">
                  <div>• Click 3-12 points on map</div>
                  <div>• Click near first point to close</div>
                  <div>• Data source: {dataSources.find((ds) => ds.id === selectedDataSource)?.name}</div>
                </div>
              )}

              <Select value={selectedDataSource} onValueChange={setSelectedDataSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  {dataSources.map((source) => (
                    <SelectItem key={source.id} value={source.id}>
                      {source.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Data Sources</SidebarGroupLabel>
          <SidebarGroupContent>
            {dataSources.map((source) => (
              <DataSourceCard key={source.id} dataSource={source} onUpdate={updateDataSource} />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Polygons ({polygons.length})</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {polygons.map((polygon) => (
                <SidebarMenuItem key={polygon.id}>
                  <div className="flex items-center justify-between w-full p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border" style={{ backgroundColor: polygon.color || "#3b82f6" }} />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{polygon.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {dataSources.find((ds) => ds.id === polygon.dataSourceId)?.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {polygon.currentValue !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          {polygon.currentValue.toFixed(1)}
                          {polygon.dataSourceId === "temperature"
                            ? "°C"
                            : polygon.dataSourceId === "humidity"
                              ? "%"
                              : polygon.dataSourceId === "wind"
                                ? "km/h"
                                : "mm"}
                        </span>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => deletePolygon(polygon.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </SidebarMenuItem>
              ))}
              {polygons.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No polygons drawn yet. Click "Draw Polygon" to start.
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

function DataSourceCard({ dataSource, onUpdate }: { dataSource: any; onUpdate: (id: string, updates: any) => void }) {
  const [newRule, setNewRule] = useState({ color: "#ef4444", operator: "<", value: 0 })
  const [isExpanded, setIsExpanded] = useState(false)

  const addRule = () => {
    const updatedRules = [...dataSource.colorRules, { ...newRule, id: Date.now().toString() }]
    onUpdate(dataSource.id, { colorRules: updatedRules })
    setNewRule({ color: "#ef4444", operator: "<", value: 0 })
  }

  const removeRule = (ruleId: string) => {
    const updatedRules = dataSource.colorRules.filter((rule: any) => rule.id !== ruleId)
    onUpdate(dataSource.id, { colorRules: updatedRules })
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{dataSource.name}</CardTitle>
          <Button size="sm" variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "−" : "+"}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-2">
          <div className="text-xs text-muted-foreground">Field: {dataSource.field}</div>

          <div className="space-y-2">
            <div className="text-xs font-medium">Color Rules:</div>
            {dataSource.colorRules.map((rule: any) => (
              <div key={rule.id} className="flex items-center gap-2 text-xs">
                <GripVertical className="h-3 w-3 text-muted-foreground" />
                <div className="w-4 h-4 rounded border" style={{ backgroundColor: rule.color }} />
                <span>
                  {rule.operator} {rule.value}
                </span>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => removeRule(rule.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-1">
            <input
              type="color"
              value={newRule.color}
              onChange={(e) => setNewRule((prev) => ({ ...prev, color: e.target.value }))}
              className="w-8 h-6 rounded border"
            />
            <Select
              value={newRule.operator}
              onValueChange={(value) => setNewRule((prev) => ({ ...prev, operator: value as any }))}
            >
              <SelectTrigger className="h-6 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="<">{"<"}</SelectItem>
                <SelectItem value="<=">{"<="}</SelectItem>
                <SelectItem value="=">=</SelectItem>
                <SelectItem value=">">{">"}</SelectItem>
                <SelectItem value=">=">{">="}</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={newRule.value}
              onChange={(e) => setNewRule((prev) => ({ ...prev, value: Number(e.target.value) }))}
              className="h-6 text-xs"
              placeholder="Value"
            />
            <Button size="sm" className="h-6 px-2" onClick={addRule}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
