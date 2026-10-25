"use client"

import type React from "react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Wilaya } from "algeria-wilayas"
import type { Category } from "@/types"
import { useRouter } from "next/navigation"
import { buildQueryString } from "@/utils/query-builder"
import { Button } from "@/components/ui/button"

interface OpportunitiesFilterProps {
  wilayas: Wilaya[]
  categories: Category[]
}

const OpportunitiesFilter: React.FC<OpportunitiesFilterProps> = ({ wilayas, categories }) => {
  const [filters, setFilters] = useState({
    wilaya: "",
    category: "",
  })

  const router = useRouter()

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const onFilterChange = (newFilters: any) => {
    const query_params = buildQueryString(newFilters)
    router.push(`?${query_params}`)
  }

  const handleClearFilters = () => {
    setFilters({ wilaya: "", category: "" })
    onFilterChange({})
  }

  return (
    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
      <Select value={filters.wilaya} onValueChange={(value) => handleFilterChange("wilaya", value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="الولاية" />
        </SelectTrigger>
        <SelectContent>
          {wilayas.map((wilaya) => (
            <SelectItem key={wilaya.code} value={wilaya.code}>
              {wilaya.name.arabic}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="التصنيف" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        className={`${filters.wilaya || filters.category ? "block" : "hidden"}`}
        variant="ghost"
        onClick={handleClearFilters}
      >
        مسح الفلاتر
      </Button>
    </div>
  )
}

export default OpportunitiesFilter
