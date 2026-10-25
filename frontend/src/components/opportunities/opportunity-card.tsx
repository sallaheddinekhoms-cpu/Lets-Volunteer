"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Calendar, Clock, Globe2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { OpportunityForCardList } from "@/types/opportunity";
import Link from "next/link";
import Image from "next/image";
import algerianWilayas from 'algeria-wilayas';

interface OpportunityCardProps {
  opportunity: OpportunityForCardList;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {

  console.log("image link", opportunity.image)
  
  // Helper function to get wilaya name from code
  const getWilayaName = (code: string) => {
    const wilaya = algerianWilayas.getWilayaByCode(code);
    return wilaya ? wilaya.name.arabic : code;
  };
  return (
    <Card className="group hover:shadow-xl 
    hover:-translate-y-1 text-right transition-all duration-300 overflow-hidden border-muted/20 hover:border-primary/20 h-full flex flex-col">
      {opportunity.image && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={opportunity.image}
            alt={opportunity.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          {/* <img
            src={opportunity.image}
            alt={opportunity.title}
            className="object-cover w-full h-full"
          /> */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/opportunities/${opportunity.id}`} className="text-xl font-bold text-primary tracking-tight hover:text-primary/80 transition-colors">
                {opportunity.title} بتاريخ {opportunity.date_of_opportunity ? format(new Date(opportunity.date_of_opportunity), 'PPP', { locale: ar }) : 'تاريخ غير متاح'}
              </Link>
              <div className="flex gap-2 flex-wrap">
                {opportunity.is_urgent && (
                  <Badge variant="destructive" className="text-sm font-medium animate-pulse">
                    عاجلة
                  </Badge>
                )}
                {opportunity.is_remote && (
                  <Badge variant="secondary" className="text-sm font-medium">
                    <Globe2 className="w-3 h-3 ml-1" />
                    عن بعد
                  </Badge>
                )}
                <Badge
                  variant={!opportunity.is_available ? "outline" : "default"}
                  className={cn(
                    "text-sm font-medium",
                    !opportunity.is_available ? "border-muted-foreground/50" : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                  )}
                >
                  {!opportunity.is_available ? "مغلق" : "متاح"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="secondary"
                className="text-sm bg-primary/10 hover:bg-primary/15 text-primary border-0"
              >
                {opportunity.category.label}
              </Badge>
              {opportunity.duration && (
                <Badge
                  variant="outline"
                  className="text-sm border-muted-foreground/30"
                >
                  <Clock className="w-3 h-3 ml-1 text-muted-foreground" />
                  {opportunity.duration} {opportunity.duration > 2 ? "أيام" : "يوم"}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-6">
        <p className="text-muted-foreground/90 line-clamp-2 text-sm leading-relaxed">
          {opportunity.description}
        </p>
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-muted-foreground/80 text-sm">
            <Building2 className="w-4 h-4 text-primary/70" />
            <span className="hover:text-primary transition-colors">
              {opportunity.organization}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground/80 text-sm">
            <MapPin className="w-4 h-4 text-primary/70" />
            <span>{getWilayaName(opportunity.wilaya)}, {opportunity.daira}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground/80 text-sm">
            <Calendar className="w-4 h-4 text-primary/70" />
            <span>
              {format(new Date(opportunity.created_at), 'PPP', { locale: ar })}
              {" "}
              <span className="text-muted-foreground/60">
                ({formatDistanceToNow(new Date(opportunity.created_at), { locale: ar, addSuffix: true })})
              </span>
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 mt-auto">
        <Link className="w-full" href={`/opportunities/${opportunity.id}`} passHref >
          <Button
            className="w-full text-white font-medium hover:opacity-90 transition-opacity bg-gradient-to-r from-primary to-primary/90"
          >
            عرض التفاصيل
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}