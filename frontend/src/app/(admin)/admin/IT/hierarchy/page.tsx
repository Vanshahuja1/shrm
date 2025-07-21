"use client"

import StatsSection from "./stats/page"
import ChartSection from "./chart/page"
import TableSection from "./table/page"

export default function OrganizationHierarchyPage() {
  return (
    <div className="space-y-6">
      <StatsSection />
      <ChartSection />
      <TableSection />
    </div>
  )
}
