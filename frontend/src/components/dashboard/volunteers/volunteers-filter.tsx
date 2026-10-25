"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Daira, Wilaya } from "algeria-wilayas"
import { useRouter } from "next/navigation"
import { buildQueryString } from "@/utils/query-builder"
import { Button } from "@/components/ui/button"

interface VolunteerFilterPros {
  wilayas: Wilaya[]
  dairas: Daira[]
  isWilayaSelected: boolean
}

const VolunteersFilter: React.FC<VolunteerFilterPros> = ({ wilayas, dairas, isWilayaSelected }) => {
  const [filters, setFilters] = useState({
    name: "",
    wilaya: "",
    daira: "",
    blood_group: "",
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
    setFilters({ wilaya: "", daira: "", blood_group: "", name: "" })
    onFilterChange({})
  }

  return (
    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
      <Input
        onChange={(e) => handleFilterChange("name", e.target.value)}
        value={filters.name}
        placeholder="بحث بالاسم..."
      />
      <Select onValueChange={(value) => handleFilterChange("wilaya", value)} value={filters.wilaya}>
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
      <Select
        disabled={!isWilayaSelected}
        onValueChange={(value) => handleFilterChange("daira", value)}
        value={filters.daira}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="الدائرة" />
        </SelectTrigger>
        <SelectContent>
          {dairas.map((daira) => (
            <SelectItem key={daira.id} value={daira.name.arabic}>
              {daira.name.arabic}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => handleFilterChange("blood_group", value)} value={filters.blood_group}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="فصيلة الدم" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="A+">A+</SelectItem>
          <SelectItem value="A-">A-</SelectItem>
          <SelectItem value="B+">B+</SelectItem>
          <SelectItem value="B-">B-</SelectItem>
          <SelectItem value="O+">O+</SelectItem>
          <SelectItem value="O-">O-</SelectItem>
          <SelectItem value="AB+">AB+</SelectItem>
          <SelectItem value="AB-">AB-</SelectItem>
        </SelectContent>
      </Select>
      <Button
        className={`${filters.wilaya || filters.daira || filters.blood_group || filters.name ? "block" : "hidden"}`}
        variant="ghost"
        onClick={handleClearFilters}
      >
        مسح الفلاتر
      </Button>
    </div>
  )
}

export default VolunteersFilter
