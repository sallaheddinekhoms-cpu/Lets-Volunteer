"use client"

import React from "react"
import dynamic from "next/dynamic"

const LocationPickerMap = dynamic(
  () => import("./location-picker-map"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[340px] w-full rounded-2xl bg-muted/60 flex flex-col items-center justify-center animate-pulse gap-2 border border-border">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-xs text-muted-foreground font-medium">جاري تحميل خريطة تحديد المكان...</p>
      </div>
    ),
  }
)

interface LocationPickerWrapperProps {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  selectedWilaya?: string;
  onChange: (coords: { latitude: number | null; longitude: number | null }) => void;
}

export default function LocationPickerWrapper(props: LocationPickerWrapperProps) {
  return <LocationPickerMap {...props} />
}
