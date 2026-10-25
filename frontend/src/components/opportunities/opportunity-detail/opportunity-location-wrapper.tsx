"use client"

import React from "react"
import dynamic from "next/dynamic"

const OpportunityLocationCard = dynamic(
  () => import("./opportunity-location-card"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] w-full rounded-3xl bg-muted/50 animate-pulse flex items-center justify-center border border-border">
        <p className="text-xs text-muted-foreground font-medium">جاري تحميل خريطة الموقع...</p>
      </div>
    ),
  }
)

interface OpportunityLocationWrapperProps {
  latitude?: number | null;
  longitude?: number | null;
  wilaya?: string;
  daira?: string;
  location_address?: string;
}

export default function OpportunityLocationWrapper(props: OpportunityLocationWrapperProps) {
  if (!props.latitude || !props.longitude) return null;
  return <OpportunityLocationCard {...props} />
}
