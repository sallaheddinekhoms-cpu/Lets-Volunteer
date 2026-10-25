"use client"

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, Compass, Layers, ExternalLink } from "lucide-react";
import Link from "next/link";

export interface OpportunityMapItem {
  id: string;
  title: string;
  wilaya: string;
  daira: string;
  categoryName?: string;
  latitude?: number | null;
  longitude?: number | null;
  is_urgent?: boolean;
}

interface OpportunitiesMapProps {
  opportunities: OpportunityMapItem[];
  defaultCenter?: [number, number];
  zoom?: number;
}

// Representative fallback coordinates for Algerian Wilayas if coordinates are not entered manually
const WILAYA_COORDS: Record<string, [number, number]> = {
  "16": [36.7538, 3.0588], // Algiers
  "19": [36.1906, 5.4103], // Setif
  "31": [35.6987, -0.6349], // Oran
  "25": [36.3650, 6.6147], // Constantine
  "09": [36.4700, 2.8300], // Blida
  "15": [36.7118, 4.0459], // Tizi Ouzou
  "06": [36.7558, 5.0843], // Bejaia
  "23": [36.9000, 7.7667], // Annaba
  "13": [34.8783, -1.3150], // Tlemcen
  "05": [35.5560, 6.1741], // Batna
  "30": [31.9500, 5.3333], // Ouargla
  "47": [32.4900, 3.6700], // Ghardaia
};

export default function OpportunitiesMap({
  opportunities = [],
  defaultCenter = [36.1906, 5.4103], // Default center on Setif/Algeria
  zoom = 7,
}: OpportunitiesMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityMapItem | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;

      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance or leaked leaflet_id to prevent "Map container is already initialized"
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if ((mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }

      // Fix default marker icon assets in Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: zoom,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomleft" }).addTo(map);

      // OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // Custom marker colors
      const greenIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const redIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      opportunities.forEach((opp) => {
        let lat = opp.latitude;
        let lng = opp.longitude;

        if (!lat || !lng) {
          const fallback = WILAYA_COORDS[opp.wilaya] || [36.1906, 5.4103];
          lat = fallback[0] + (Math.random() - 0.5) * 0.05;
          lng = fallback[1] + (Math.random() - 0.5) * 0.05;
        }

        const marker = L.marker([Number(lat), Number(lng)], {
          icon: opp.is_urgent ? redIcon : greenIcon,
        }).addTo(map);

        const popupContent = `
          <div dir="rtl" style="font-family: inherit; padding: 4px; min-width: 180px; text-align: right;">
            <div style="font-size: 11px; color: #17B2A8; font-weight: bold; margin-bottom: 2px;">
              ${opp.categoryName || "فرصة تطوعية"}
            </div>
            <h4 style="margin: 0 0 6px 0; font-size: 14px; font-weight: bold; color: #1f2937;">
              ${opp.title}
            </h4>
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
              📍 ${opp.daira || ""} ${opp.wilaya ? `(ولاية ${opp.wilaya})` : ""}
            </div>
            <a href="/opportunities/${opp.id}" style="display: inline-block; background-color: #105D56; color: white; padding: 4px 10px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: bold;">
              عرض التفاصيل
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on("click", () => {
          if (isMounted) setSelectedOpportunity(opp);
        });
      });

      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current && (mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }
    };
  }, [opportunities]);

  const locateUser = () => {
    if (!navigator.geolocation) {
      alert("خاصية تحديد الموقع غير مدعومة في متصفحك.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 12);
        }
      },
      (err) => {
        console.error(err);
        alert("تعذر الحصول على موقعك الحالي. تأكد من تفعيل أذونات الموقع.");
      }
    );
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-gray-200/80 shadow-xl bg-white" dir="rtl">
      {/* Top Header Bar */}
      <div className="bg-white/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">الخريطة التفاعلية للفرص التطوعية</h3>
            <p className="text-xs text-gray-500">استكشف الفرص المتاحة جغرافياً وتعرف على المبادرات الأقرب إليك</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>فرصة عادية</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 mr-2"></span>
            <span>فرصة عاجلة</span>
          </div>

          <button
            onClick={locateUser}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>موقعي الحالي</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="relative h-[480px] w-full">
        <div ref={mapContainerRef} className="h-full w-full z-0" />
      </div>
    </div>
  );
}
