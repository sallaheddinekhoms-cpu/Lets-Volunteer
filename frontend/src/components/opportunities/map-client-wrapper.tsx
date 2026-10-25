"use client"

import React from "react"
import dynamic from "next/dynamic"

const OpportunitiesMap = dynamic(
  () => import("./opportunities-map"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full rounded-3xl bg-muted flex items-center justify-center animate-pulse">
        <p className="text-muted-foreground font-medium">جاري تحميل خريطة الفرص التطوعية التفاعلية...</p>
      </div>
    ),
  }
)

export default function MapClientWrapper({ opportunities }: { opportunities: any[] }) {
  return <OpportunitiesMap opportunities={opportunities} />
}
