"use client"

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, Compass, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ALGERIA_WILAYA_COORDINATES: Record<string, [number, number]> = {
  "01": [27.8742, -0.2939], // أدرار
  "02": [36.1653, 1.3344],  // الشلف
  "03": [33.8000, 2.8651],  // الأغواط
  "04": [35.8756, 7.1136],  // أم البواقي
  "05": [35.5560, 6.1741],  // باتنة
  "06": [36.7558, 5.0843],  // بجاية
  "07": [34.8500, 5.7333],  // بسكرة
  "08": [31.6167, -2.2167], // بشار
  "09": [36.4700, 2.8300],  // البليدة
  "10": [36.3749, 3.9020],  // البويرة
  "11": [22.7850, 5.5228],  // تمنراست
  "12": [35.4042, 8.1242],  // تبسة
  "13": [34.8783, -1.3150], // تلمسان
  "14": [35.3710, 1.3170],  // تيارت
  "15": [36.7118, 4.0459],  // تيزي وزو
  "16": [36.7538, 3.0588],  // الجزائر
  "17": [34.6728, 3.2630],  // الجلفة
  "18": [36.8206, 5.7667],  // جيجل
  "19": [36.1906, 5.4103],  // سطيف
  "20": [34.8303, 0.1517],  // سعيدة
  "21": [36.8792, 6.9069],  // سكيكدة
  "22": [35.1899, -0.6309], // سيدي بلعباس
  "23": [36.9000, 7.7667],  // عنابة
  "24": [36.4621, 7.4261],  // قالمة
  "25": [36.3650, 6.6147],  // قسنطينة
  "26": [36.2642, 2.7539],  // المدية
  "27": [35.9312, 0.0892],  // مستغانم
  "28": [35.7058, 4.5419],  // المسيلة
  "29": [35.3966, 0.1403],  // معسكر
  "30": [31.9500, 5.3333],  // ورقلة
  "31": [35.6987, -0.6349], // وهران
  "32": [32.6990, 1.0124],  // البيض
  "33": [26.5050, 8.4814],  // إليزي
  "34": [36.0732, 4.7611],  // برج بوعريريج
  "35": [36.7664, 3.4772],  // بومرداس
  "36": [36.7672, 8.3138],  // الطارف
  "37": [27.6743, -8.1478], // تندوف
  "38": [35.6072, 1.8108],  // تيسمسيلت
  "39": [33.3683, 6.8675],  // الوادي
  "40": [35.4358, 7.1433],  // خنشلة
  "41": [36.2864, 7.9511],  // سوق أهراس
  "42": [36.5925, 2.4475],  // تيبازة
  "43": [36.4503, 6.2644],  // ميلة
  "44": [36.2644, 1.9678],  // عين الدفلى
  "45": [32.7567, -0.3144], // النعامة
  "46": [35.3028, -1.1403], // عين تموشنت
  "47": [32.4900, 3.6700],  // غرداية
  "48": [35.7444, 0.5558],  // غليزان
  "49": [29.2639, 0.2319],  // تيميمون
  "50": [21.3283, 0.9236],  // برج باجي مختار
  "51": [34.3333, 5.0667],  // أولاد جلال
  "52": [30.1333, -2.1667], // بني عباس
  "53": [27.2103, 2.4608],  // عين صالح
  "54": [19.5667, 5.7667],  // عين قزام
  "55": [33.1075, 6.0644],  // تقرت
  "56": [24.5539, 9.4844],  // جانت
  "57": [33.9500, 5.9167],  // المغير
  "58": [30.5833, 2.8833],  // المنيعة
};

const WILAYA_NAMES_TO_CODE: Record<string, string> = {
  "أدرار": "01", "الشلف": "02", "الأغواط": "03", "أم البواقي": "04", "باتنة": "05",
  "بجاية": "06", "بسكرة": "07", "بشار": "08", "البليدة": "09", "البويرة": "10",
  "تمنراست": "11", "تبسة": "12", "تلمسان": "13", "تيارت": "14", "تيزي وزو": "15",
  "الجزائر": "16", "الجلفة": "17", "جيجل": "18", "سطيف": "19", "سعيدة": "20",
  "سكيكدة": "21", "سيدي بلعباس": "22", "عنابة": "23", "قالمة": "24", "قسنطينة": "25",
  "المدية": "26", "مستغانم": "27", "المسيلة": "28", "معسكر": "29", "ورقلة": "30",
  "وهران": "31", "البيض": "32", "إليزي": "33", "برج بوعريريج": "34", "بومرداس": "35",
  "الطارف": "36", "تندوف": "37", "تيسمسيلت": "38", "الوادي": "39", "خنشلة": "40",
  "سوق أهراس": "41", "تيبازة": "42", "ميلة": "43", "عين الدفلى": "44", "النعامة": "45",
  "عين تموشنت": "46", "غرداية": "47", "غليزان": "48", "تيميمون": "49", "برج باجي مختار": "50",
  "أولاد جلال": "51", "بني عباس": "52", "عين صالح": "53", "عين قزام": "54", "تقرت": "55",
  "جانت": "56", "المغير": "57", "المنيعة": "58"
};

interface LocationPickerMapProps {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  selectedWilaya?: string;
  onChange: (coords: { latitude: number | null; longitude: number | null }) => void;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  selectedWilaya,
  onChange,
}: LocationPickerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Parse valid coordinates
  const currentLat = typeof latitude === "number" && !isNaN(latitude) ? latitude : null;
  const currentLng = typeof longitude === "number" && !isNaN(longitude) ? longitude : null;
  const hasCoords = currentLat !== null && currentLng !== null;

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (!mapContainerRef.current) return;
      const L = (await import("leaflet")).default;
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if ((mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }

      // Default center: if coordinates exist, use them; else Setif/Algiers
      const defaultCenter: [number, number] = hasCoords
        ? [currentLat!, currentLng!]
        : [36.1906, 5.4103];

      const defaultZoom = hasCoords ? 13 : 7;

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Clean OpenStreetMap TileLayer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      // Custom Zoom Control at bottom-left
      L.control.zoom({ position: "bottomleft" }).addTo(map);

      // Function to create custom modern marker icon
      const createPinIcon = () => {
        return L.divIcon({
          className: "custom-location-pin",
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; transform: translate(-18px, -36px);">
              <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(16, 93, 86, 0.3); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: relative; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: linear-gradient(135deg, #17B2A8, #105D56); border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
                <div style="width: 10px; height: 10px; border-radius: 50%; background: #ffffff;"></div>
              </div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [0, 0],
          popupAnchor: [0, -32],
        });
      };

      // If initial coordinates exist, place the marker
      if (hasCoords) {
        const marker = L.marker([currentLat!, currentLng!], {
          icon: createPinIcon(),
          draggable: true,
        }).addTo(map);

        marker.bindPopup("<b>📍 مكان الفرصة المختار</b><br><small>اسحب المؤشر لضبط المكان بدقة</small>").openPopup();

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          onChange({
            latitude: Number(pos.lat.toFixed(6)),
            longitude: Number(pos.lng.toFixed(6)),
          });
        });

        markerRef.current = marker;
      }

      // Click to pick location
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        const newLat = Number(lat.toFixed(6));
        const newLng = Number(lng.toFixed(6));

        if (markerRef.current) {
          markerRef.current.setLatLng([newLat, newLng]);
          markerRef.current.openPopup();
        } else {
          const newMarker = L.marker([newLat, newLng], {
            icon: createPinIcon(),
            draggable: true,
          }).addTo(map);

          newMarker.bindPopup("<b>📍 مكان الفرصة المختار</b><br><small>اسحب المؤشر لضبط المكان بدقة</small>").openPopup();

          newMarker.on("dragend", () => {
            const pos = newMarker.getLatLng();
            onChange({
              latitude: Number(pos.lat.toFixed(6)),
              longitude: Number(pos.lng.toFixed(6)),
            });
          });

          markerRef.current = newMarker;
        }

        onChange({ latitude: newLat, longitude: newLng });
      });
    }

    init();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // When selectedWilaya changes and user doesn't already have custom coordinates, pan to that wilaya
  useEffect(() => {
    if (!selectedWilaya || !mapInstanceRef.current) return;

    let code = selectedWilaya;
    if (WILAYA_NAMES_TO_CODE[selectedWilaya]) {
      code = WILAYA_NAMES_TO_CODE[selectedWilaya];
    } else {
      // Clean string (e.g., '19' or 'سطيف')
      const trimmed = selectedWilaya.replace(/^0+/, "");
      for (const [name, c] of Object.entries(WILAYA_NAMES_TO_CODE)) {
        if (selectedWilaya.includes(name) || selectedWilaya === c || trimmed === c.replace(/^0+/, "")) {
          code = c;
          break;
        }
      }
    }

    const wilayaCoords = ALGERIA_WILAYA_COORDINATES[code];
    if (wilayaCoords && mapInstanceRef.current) {
      // If user hasn't explicitly placed a marker, fly to wilaya
      if (!hasCoords) {
        mapInstanceRef.current.flyTo(wilayaCoords, 10, { duration: 1.2 });
      }
    }
  }, [selectedWilaya, hasCoords]);

  // Handler for GPS button
  const handleGPS = () => {
    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم تحديد الموقع الجغرافي");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 15, { duration: 1.5 });

          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
            markerRef.current.openPopup();
          }
        }
        onChange({ latitude: lat, longitude: lng });
      },
      (err) => {
        setIsLocating(false);
        alert("تعذر الحصول على موقعك الحالي. تأكد من تفعيل إذن الموقع في المتصفح.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Handler to remove marker
  const handleClear = () => {
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    onChange({ latitude: null, longitude: null });
  };

  return (
    <div className="space-y-3" dir="rtl">
      {/* Top Map Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50 p-3 rounded-2xl border border-border">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Compass className="w-4 h-4 text-primary animate-spin-slow" />
            <span>انقر على الخريطة لتثبيت مكان النشاط</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            يمكنك النقر في أي نقطة أو سحب المؤشر لضبط مكان إقامة الفرصة بدقة بالغة.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGPS}
            disabled={isLocating}
            className="h-8 gap-1.5 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/10 rounded-xl"
            title="تحديد موقعي الآن"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
            <span>{isLocating ? "جاري التحديد..." : "موقعي الحالي (GPS)"}</span>
          </Button>

          {hasCoords && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 gap-1 text-xs text-destructive hover:bg-destructive/10 rounded-xl px-2"
              title="مسح الإحداثيات المحددة"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>إلغاء التحديد</span>
            </Button>
          )}
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[340px] sm:h-[380px] rounded-2xl overflow-hidden border-2 border-primary/20 shadow-inner bg-slate-100 z-0">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Coordinates Tag */}
        {hasCoords ? (
          <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-primary/30 flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div className="font-mono text-foreground font-semibold text-[11px]">
              <span>خط العرض: {currentLat}</span>
              <span className="mx-1.5 text-muted-foreground">|</span>
              <span>خط الطول: {currentLng}</span>
            </div>
          </div>
        ) : (
          <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-border flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
            <span>لم يتم وضع المؤشر بعد - اضغط على الخريطة لتثبيته</span>
          </div>
        )}
      </div>
    </div>
  );
}
