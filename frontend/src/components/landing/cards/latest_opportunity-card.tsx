"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { OpportunityForCardList } from "@/types/opportunity";
import Link from "next/link";
import algerianWilayas from 'algeria-wilayas';

interface OpportunityCardProps {
  opportunity: Partial<OpportunityForCardList>;
}

export const LatestOpportunityCard = ({ opportunity }: OpportunityCardProps) => {
  
  // Helper function to get wilaya name from code
  const getWilayaName = (code: string) => {
    const wilaya = algerianWilayas.getWilayaByCode(code);
    return wilaya ? wilaya.name.arabic : code;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full sm:w-[350px] md:w-[380px]"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 w-full">
          <img
            src={opportunity.image || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=1000"}
            alt={opportunity.title || 'Volunteer opportunity image'}
            className="object-cover w-full h-full"
          />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90 text-primary font-medium">
              {opportunity.category?.label}
            </Badge>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <Link href={`/opportunities/${opportunity.id}`}>
          <h3 className="text-xl font-semibold text-primary line-clamp-2 text-right">
            {opportunity.title}
          </h3>
          </Link>

          <div className="space-y-2">
            <div className="flex items-center justify-end gap-2 text-muted-foreground">
              <span className="text-sm">{opportunity.organization}</span>
              <Building2 className="w-4 h-4" />
            </div>
            
            <div className="flex items-center justify-end gap-2 text-muted-foreground">
              <span className="text-sm">{`${opportunity.daira}, ${opportunity.wilaya ? getWilayaName(opportunity.wilaya) : ''}`}</span>
              <MapPin className="w-4 h-4" />
            </div>
            
            {opportunity.duration && (
              <div className="flex items-center justify-end gap-2 text-muted-foreground">
                <span className="text-sm">{`${opportunity.duration} ساعة`}</span>
                <Clock className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}