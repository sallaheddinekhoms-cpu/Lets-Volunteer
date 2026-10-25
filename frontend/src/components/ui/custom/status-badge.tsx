import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

export const statusConfig = {
  accepted: { color: "bg-green-100 text-green-800", icon: CheckCircle2, label: "مقبول" },
  done: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "منجز" },
  refused: { color: "bg-red-100 text-red-800", icon: XCircle, label: "مرفوض" },
  pending: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "قيد الانتظار" }
} as const;

type StatusType = keyof typeof statusConfig;

export function StatusBadge({ status }: { status: StatusType }) {

  const config = statusConfig[status] ?? statusConfig.pending;
  const Icon = config.icon;
 
  return (
    <Badge variant="secondary" className={`${config.color} flex items-center gap-2`}>
      <Icon className="w-4 h-4" />
      {config.label}
    </Badge>
  );
}

export default StatusBadge;