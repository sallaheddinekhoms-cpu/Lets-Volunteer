'use client';

import React from "react"

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  SlidersHorizontal, 
  Clock, 
  X,
  Timer,
  Loader2 
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { buildQueryString } from "@/utils/query-builder";
import algerianWilayas from 'algeria-wilayas';

interface FilterSectionProps {
  categories: { id: string; label: string }[];
  wilayas: any[];
}

export function FilterSection({ categories, wilayas }: FilterSectionProps) {
  const router = useRouter();
  

  const [filters, setFilters] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return {
        search: urlParams.get('search') || "",
        category: urlParams.get('category') || "",
        wilaya: urlParams.get('wilaya') || "",
        daira: urlParams.get('daira') || "",
        duration: urlParams.get('duration') || "",
        is_remote: urlParams.get('is_remote') === 'true',
        is_urgent: urlParams.get('is_urgent') === 'true',
        is_available: urlParams.get('is_available') === 'true',
      };
    }
    return {
      search: "",
      category: "",
      wilaya: "",
      daira: "",
      duration: "",
      is_remote: false,
      is_urgent: false,
      is_available: false,
    };
  });

  // Get available communes based on selected wilaya
  const availableCommunes = useMemo(() => {
    if (!filters.wilaya) return [];
    return algerianWilayas.getDairasByWilaya(filters.wilaya);
  }, [filters.wilaya]);

  // Sync filters with URL params on component mount and URL changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlFilters = {
        search: urlParams.get('search') || "",
        category: urlParams.get('category') || "",
        wilaya: urlParams.get('wilaya') || "",
        daira: urlParams.get('daira') || "",
        duration: urlParams.get('duration') || "",
        is_remote: urlParams.get('is_remote') === 'true',
        is_urgent: urlParams.get('is_urgent') === 'true',
        is_available: urlParams.get('is_available') === 'true',
      };
      setFilters(urlFilters);
    }
  }, []);


  

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const onFilterChange = async (newFilters: any) => {
    setIsLoading(true);
    const query_params = buildQueryString(newFilters);
    router.push(`/opportunities?${query_params}`);
    // Add a small delay to show loading state
    setTimeout(() => setIsLoading(false), 500);
  }

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    
    // If wilaya changes, reset daira
    if (key === "wilaya") {
      newFilters.daira = "";
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 1 && parseInt(value) <= 30)) {
      handleFilterChange("duration", value);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      category: "",
      wilaya: "",
      daira: "",
      duration: "",
      is_remote: false,
      is_urgent: false,
      is_available: false,
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
    setIsOpen(false);
    router.push("/opportunities");
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== "" && value !== false
    ).length;
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm space-y-4" dir="rtl">
      <div className="flex flex-col gap-4">
        {/* Category Tabs */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            <span className="text-sm font-medium text-muted-foreground">التصنيف</span>
          </div>
          <div className="flex flex-row gap-2 flex-wrap">
            {/* All Categories Button */}
          

            {/* Category Tabs */}
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (index + 1) * 0.05 }}
              >
                <Button
                  onClick={() => handleFilterChange("category", category.id)}
                  variant={filters.category === category.id ? "default" : "outline"}
                  className={`rounded-full px-4 h-9 text-sm whitespace-nowrap transition-all ${
                    filters.category === category.id
                      ? "bg-primary text-white shadow-md"
                      : "hover:bg-accent"
                  }`}
                  disabled={isLoading}
                >
                  {category.label}
                </Button>
              </motion.div>
            ))}

              <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0 * 0.05 }}
              key="all"
            >
              <Button
                onClick={() => handleFilterChange("category", "")}
                variant={!filters.category ? "default" : "outline"}
                className={`rounded-full px-4 h-9 text-sm whitespace-nowrap transition-all ${
                  !filters.category
                    ? "bg-primary text-white shadow-md"
                    : "hover:bg-accent"
                }`}
                disabled={isLoading}
              >
                الكل
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Other Filters Row */}
        <div className="flex flex-row-reverse justify-end gap-2 flex-wrap lg:flex-nowrap">
          <Select
            value={filters.daira}
            onValueChange={(value) => {
              if(value === "all") {
                handleFilterChange("daira", "");
              } else {
                handleFilterChange("daira", value);
              }
            }}
            disabled={!filters.wilaya || isLoading}
          >
            <SelectTrigger className="w-full lg:w-[180px] text-right">
              {isLoading && filters.wilaya ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>جاري التحميل...</span>
                </div>
              ) : (
                <SelectValue placeholder={filters.wilaya ? "البلدية" : "اختر الولاية أولاً"} />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {availableCommunes.map((daira) => (
                <SelectItem key={daira.id} value={daira.name.arabic}>
                  {daira.name.arabic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.wilaya}
            onValueChange={(value) => {
              if(value === "all") {
                handleFilterChange("wilaya", "");
              } else {
                handleFilterChange("wilaya", value);
              }
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full lg:w-[180px] text-right">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>جاري التحميل...</span>
                </div>
              ) : (
                <SelectValue placeholder="الولاية" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {wilayas.map((wilaya) => (
                <SelectItem key={wilaya.code} value={wilaya.code}>
                  {wilaya.name.arabic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full lg:w-auto relative bg-transparent"
              >
                <SlidersHorizontal className="h-4 w-4 ml-2" />
                خيارات متقدمة
                {getActiveFiltersCount() > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -left-2"
                  >
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4" dir="rtl">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">خيارات متقدمة</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4 ml-2" />
                    مسح الكل
                  </Button>
                </div>
                <Separator />
                
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Timer className="h-4 w-4 ml-2" />
                    المدة (بالأيام) أقل من
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="30"
                      value={filters.duration}
                      onChange={handleDurationChange}
                      className="text-right"
                      placeholder="1-30"
                    />
                    <span className="text-sm text-muted-foreground">يوم</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_remote" className="flex items-center gap-2">
                      عن بعد
                    </Label>
                    <Switch
                      id="is_remote"
                      checked={filters.is_remote}
                      onCheckedChange={(checked) => handleFilterChange("is_remote", checked)}
                      Rtl
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_urgent" className="flex items-center gap-2">
                      <Badge variant="destructive" className="ml-2">عاجل</Badge>
                      فرص عاجلة
                    </Label>
                    <Switch
                      id="is_urgent"
                      checked={filters.is_urgent}
                      onCheckedChange={(checked) => handleFilterChange("is_urgent", checked)}
                      Rtl
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="availableNow" className="flex items-center gap-2">
                      <Clock className="h-4 w-4 ml-2" />
                      متاح الآن
                    </Label>
                    <Switch
                      id="availableNow"
                      checked={filters.is_available}
                      onCheckedChange={(checked) => handleFilterChange("is_available", checked)}
                      Rtl
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || value === "") return null;
            
            let label = "";
            if (key === "category") {
              label = categories.find(c => c.id === value)?.label || "";
            } else if (key === "wilaya") {
              const wilayaName = wilayas.find(w => w.code === value)?.name.arabic || value;
              label = `الولاية: ${wilayaName}`;
            } else if (key === "daira") {
              label = `البلدية: ${value}`;
            } else if (key === "duration") {
              label = `${value} يوم`;
            } else if (key === "is_remote" && value) {
              label = "عن بعد";
            } else if (key === "is_urgent" && value) {
              label = "عاجل";
            } else if (key === "is_available" && value) {
              label = "متاح الآن";
            }

            if (!label) return null;

            return (
              <Badge 
                key={key}
                variant="secondary"
                className="gap-1"
              >
                {label}
                <X 
                  className="h-3 w-3 cursor-pointer mr-1" 
                  onClick={() => {
                    if (key === "search" || key === "category" || key === "wilaya" || key === "daira" || key === "duration") {
                      handleFilterChange(key, "");
                    } else {
                      handleFilterChange(key, false);
                    }
                  }}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FilterSection;
