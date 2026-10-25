"use client"

import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OpportunityLocationCardProps {
  latitude?: number | null;
  longitude?: number | null;
  wilaya?: string;
  daira?: string;
  location_address?: string;
}

export default function OpportunityLocationCard({
  latitude,
  longitude,
  wilaya,
  daira,
  location_address,
}: OpportunityLocationCardProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const hasCoords = typeof latitude === "number" && !isNaN(latitude) && typeof longitude === "number" && !isNaN(longitude);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (!hasCoords || !mapContainerRef.current) return;
      const L = (await import("leaflet")).default;
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if ((mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }

      const map = L.map(mapContainerRef.current, {
        center: [latitude!, longitude!],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomleft" }).addTo(map);

      const customIcon = L.divIcon({
        className: "opportunity-location-marker",
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; transform: translate(-18px, -36px);">
            <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(16, 93, 86, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: linear-gradient(135deg, #17B2A8, #105D56); border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
              <div style="width: 10px; height: 10px; border-radius: 50%; background: #ffffff;"></div>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [0, 0],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([latitude!, longitude!], { icon: customIcon }).addTo(map);
      marker.bindPopup(`<b>مقر الفعالية التطوعية</b><br><small>${daira ? `${daira} - ` : ""}${wilaya || ""}</small>`).openPopup();
    }

    init();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [hasCoords, latitude, longitude, wilaya, daira]);

  if (!hasCoords) return null;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <Card className="rounded-3xl border border-border shadow-xs overflow-hidden" dir="rtl">
      <CardHeader className="pb-3 border-b border-border/50 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span>موقع الفعالية الميدانية</span>
          </CardTitle>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
          >
            <span>فتح في الخرائط</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full h-[220px] bg-slate-100 z-0">
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        </div>
        <div className="p-4 bg-white flex items-center justify-between gap-3 text-xs">
          <div className="text-muted-foreground">
            {location_address ? (
              <p className="font-medium text-foreground">{location_address}</p>
            ) : (
              <p>{daira ? `${daira}، ` : ""}ولاية {wilaya || ""}</p>
            )}
            <span className="text-[11px] font-mono text-muted-foreground/70">
              {latitude?.toFixed(5)}, {longitude?.toFixed(5)}
            </span>
          </div>

          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-primary hover:bg-[#105D56] text-white text-xs gap-1.5 rounded-xl h-8">
              <Navigation className="w-3.5 h-3.5" />
              <span>الاتجاهات</span>
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
