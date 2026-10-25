"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Input } from "@/components/ui/input";
import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
} from "@/components/ui/select";
import { Daira, Wilaya } from 'algeria-wilayas';
import { useRouter } from 'next/navigation';
import { buildQueryString } from '@/utils/query-builder';
import { Button } from '@/components/ui/button';


interface OrganizationFilterProps {
      wilayas: Wilaya[],
      dairas: Daira[]
      isWilayaSelected: boolean
}
const OrganizationFilter: React.FC<OrganizationFilterProps> = (
      { wilayas, dairas, isWilayaSelected }
) => {
      const [filters, setFilters] = useState({
            wilaya: '',
            daira: '',
            organization_name: ''
      })
      const router = useRouter()

      const handleFilterChange = (key: string, value: any) => {
            const newFilters = { ...filters, [key]: value }
            setFilters(newFilters)
            onFilterChange(newFilters)
      }

      const onFilterChange = (newFilters: any)   => {
            const query_params = buildQueryString(newFilters);
            router.push(`?${query_params}`);
      }


      const handleClearFilters = () => {
            setFilters({ wilaya: '', daira: '', organization_name: '' })

            onFilterChange({})
      }
      const searchTimeout = useRef<NodeJS.Timeout | null>(null);

      useEffect(() => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);

            searchTimeout.current = setTimeout(() => {
                  if (filters.organization_name) {
                        onFilterChange(filters)
                  }
                  
            }, 2000);

            return () => {
                  if (searchTimeout.current) clearTimeout(searchTimeout.current);
            };

      }
            , [filters.organization_name])

      const handleOrganizaitonName = (value: string) => {
            const newFilters = { ...filters, organization_name: value }
            setFilters(newFilters)
            router.push(`?${buildQueryString(newFilters)}`);
      }

      return (
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Input value={filters.organization_name} onChange={(e) => { handleOrganizaitonName(e.target.value) }} placeholder="بحث بالاسم..." />
                  <Select
                        onValueChange={(value) => handleFilterChange('wilaya', value)}
                        value={filters.wilaya}
                  >
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
                        onValueChange={(value) => handleFilterChange('daira', value)}
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

                  <Button
                        className={`${filters.wilaya || filters.daira || filters.organization_name ? 'block' : 'hidden'}`}
                        variant="ghost" onClick={handleClearFilters}>
                        مسح الفلاتر
                  </Button>

            </div>
      )
}

export default OrganizationFilter
