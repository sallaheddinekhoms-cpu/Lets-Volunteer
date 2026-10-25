"use client"
import {

  Search

} from 'lucide-react';
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

export const statusConfig = {
  accepted: { color: "bg-green-100 text-green-800", icon: CheckCircle2, label: "مقبول" },
  done: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "منجز" },
  refused: { color: "bg-red-100 text-red-800", icon: XCircle, label: "مرفوض" },
  pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "قيد الانتظار" }
};

const ParticipationsFilter = () => {
  return (
    <Card className="mb-6">
    <CardContent className="p-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="البحث عن متطوع..."
            
              className="pr-10"
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <Select  >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {Object.entries(statusConfig).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="الولاية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="Algiers">الجزائر</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardContent>
  </Card>
  )
}

export default ParticipationsFilter
