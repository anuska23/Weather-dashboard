"use client"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { MapContainer } from "@/components/map-container"
import { TimelineSlider } from "@/components/timeline-slider"
import { DashboardProvider } from "@/contexts/dashboard-context"

export default function Dashboard() {
  return (
    <DashboardProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <div className="border-b p-4">
              <TimelineSlider />
            </div>
            <div className="flex-1">
              <MapContainer />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </DashboardProvider>
  )
}
