"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Clock, XCircle, AlertCircle, Search, Filter, X } from "lucide-react"
import ParticipationCard from "@/components/profile/participation-card"
import type { ParticipationForVolunteer } from "@/types/participation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useMediaQuery } from "@/hooks/use-media-query"

type ParticipationStatus = "accepted" | "done" | "refused" | "pending"

export const statusConfig = {
  accepted: { color: "bg-green-100 text-green-800", icon: CheckCircle2, label: "مقبول" },
  done: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "منجز" },
  refused: { color: "bg-red-100 text-red-800", icon: XCircle, label: "مرفوض" },
  pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "قيد الانتظار" },
}

interface VolunteerOpportunitySectionProps {
  participations: ParticipationForVolunteer[]
}

export const VolunteerOpportunitiesSection: React.FC<VolunteerOpportunitySectionProps> = ({ participations }) => {
  const [selectedStatus, setSelectedStatus] = useState<ParticipationStatus | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  // Check if screen is mobile
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Simulate loading state for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredParticipations = participations.filter((participation) => {
    const matchesStatus = selectedStatus === "all" || participation.status === selectedStatus
    const matchesSearch =
      !searchTerm ||
      participation.opportunity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participation.opportunity.organization?.organization_name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  const countByStatus = {
    all: participations.length,
    accepted: participations.filter((p) => p.status === "accepted").length,
    done: participations.filter((p) => p.status === "done").length,
    refused: participations.filter((p) => p.status === "refused").length,
    pending: participations.filter((p) => p.status === "pending").length,
  }

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="p-4 md:p-6 border-primary/10 shadow-md bg-gradient-to-b from-white to-primary/5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
        >
          <h2 className="text-xl md:text-2xl font-bold text-primary-foreground">الفرص التطوعية</h2>
          <div className="w-full md:w-auto relative">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="ابحث عن فرصة أو منظمة..."
                className="w-full md:w-64 pr-10 pl-10 py-2 rounded-lg border-primary/20 focus:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground"
                  onClick={handleClearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value)
            setSelectedStatus(value as ParticipationStatus | "all")
          }}
          className="mb-6"
          dir="rtl"
        >
          <TabsList className={`bg-muted/50 p-1 rounded-full flex ${isMobile ? "flex-wrap gap-1 justify-center" : ""}`}>
            <TabsTrigger
              value="all"
              className={`rounded-full data-[state=active]:bg-primary data-[state=active]:text-white ${isMobile ? "text-xs" : ""}`}
            >
              الكل
              <Badge
                variant="secondary"
                className={`${isMobile ? "mr-1 text-xs" : "mr-2"} bg-muted-foreground/20 text-white`}
              >
                {countByStatus.all}
              </Badge>
            </TabsTrigger>
            {Object.entries(statusConfig).map(([status, config]) => (
              <TabsTrigger
                key={status}
                value={status}
                className={`rounded-full data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-1 ${isMobile ? "text-xs" : ""}`}
              >
                <config.icon className={`${isMobile ? "w-3 h-3" : "w-3.5 h-3.5"}`} />
                {config.label}
                <Badge
                  variant="secondary"
                  className={`${isMobile ? "mr-1 text-xs" : "mr-1"} bg-muted-foreground/20 text-white`}
                >
                  {countByStatus[status as ParticipationStatus]}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-4 h-[200px]">
                  <div className="flex justify-between items-start mb-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-1/5 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-8 w-1/3 rounded-md" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <motion.div
                key={selectedStatus}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {filteredParticipations.map((participation) => (
                  <ParticipationCard key={participation.id} participation={participation} />
                ))}
              </motion.div>

              {filteredParticipations.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 px-4"
                >
                  <div className="bg-muted/30 rounded-lg p-8 inline-block">
                    <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">لم يتم العثور على أي فرص</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      لم يتم العثور على أي فرص تطوعية تطابق معايير البحث الحالية. يرجى تغيير معايير البحث أو تصفية
                      النتائج.
                    </p>
                    {searchTerm && (
                      <Button variant="outline" className="mt-4" onClick={handleClearSearch}>
                        مسح البحث
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
