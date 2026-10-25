"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { OpportunityCard } from "./opportunity-card";
import { FilterSection } from "./opportunity-filter";
import { OpportunityForCardList } from "@/types/opportunity";
import { Leaf, Heart, HandHeart, TreePine, Map, LayoutGrid } from "lucide-react";
import dynamicImport from "next/dynamic";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Dynamically import map component to prevent SSR window/leaflet issues
const OpportunitiesMap = dynamicImport(
  () => import("./opportunities-map"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[480px] w-full rounded-3xl bg-gray-100 flex items-center justify-center animate-pulse">
        <p className="text-gray-400 font-medium">جاري تحميل الخريطة التفاعلية للفرص...</p>
      </div>
    )
  }
);

interface OpportunitiesSectionProps {
  opportunities: OpportunityForCardList[];
  categories: { id: string; label: string }[];
  wilayas: any[];
  currentPage: number;
  totalPages: number;
  initialViewMode?: "grid" | "map";
}

export function OpportunitiesSection({
  opportunities,
  categories,
  wilayas,
  currentPage,
  totalPages,
  initialViewMode = "grid"
}: OpportunitiesSectionProps) {
  const [viewMode, setViewMode] = useState<"grid" | "map">(initialViewMode);

  const mapItems = opportunities.map((opp) => ({
    id: opp.id,
    title: opp.title,
    wilaya: opp.wilaya,
    daira: opp.daira,
    categoryName: opp.category?.label,
    latitude: (opp as any).latitude,
    longitude: (opp as any).longitude,
    is_urgent: opp.is_urgent,
  }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-background/50">
      <motion.div
        className="absolute top-20 left-10 text-primary/10 pointer-events-none"
        animate={{ rotate: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Leaf size={80} />
      </motion.div>

      <motion.div
        className="absolute top-40 right-20 text-secondary/10 pointer-events-none"
        animate={{ rotate: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <HandHeart size={100} />
      </motion.div>

      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 py-8 px-4">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-8">
          <motion.div
            className="inline-block bg-primary/5 rounded-lg px-6 py-2 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium">فرص التطوع في الجزائر</span>
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            ساهم في صنع التغيير
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            اكتشف فرص التطوع المتاحة جغرافياً وكن جزءاً من المبادرات التي تصنع الفرق
          </motion.p>
        </div>

        <div className="container mx-auto px-4 max-w-7xl">
          {/* Controls Bar: Filters & View Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex-1 min-w-[280px]">
              <FilterSection categories={categories} wilayas={wilayas} />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner shrink-0" dir="rtl">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>عرض شبكي</span>
              </button>

              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  viewMode === "map"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Map className="w-4 h-4 text-secondary" />
                <span>الخريطة التفاعلية GPS</span>
              </button>
            </div>
          </div>

          {/* Conditional View Rendering */}
          {viewMode === "map" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mb-12"
            >
              <OpportunitiesMap opportunities={mapItems} />
            </motion.div>
          ) : (
            <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {opportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <OpportunityCard opportunity={opportunity} />
                </motion.div>
              ))}
            </div>
          )}

          {opportunities.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 my-8">
              <p className="text-muted-foreground text-lg">
                لم يتم العثور على فرص تطوع مطابقة لمعايير البحث الحالية
              </p>
            </div>
          )}
        </div>
      </div>

      {viewMode === "grid" && totalPages > 1 && (
        <Pagination className="z-50 mb-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`?page=${currentPage - 1}`}
                onClick={(e) => {
                  if (currentPage === 1) e.preventDefault();
                }}
                className={`${Number(currentPage) === 1 ? "pointer-events-none opacity-50" : ""}`}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink isActive={currentPage === i + 1} href={`?page=${i + 1}`}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={`?page=${Number(currentPage) + 1}`}
                onClick={(e) => {
                  if (currentPage === totalPages) e.preventDefault();
                }}
                className={`${Number(currentPage) === Number(totalPages) ? "pointer-events-none opacity-50" : ""}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
