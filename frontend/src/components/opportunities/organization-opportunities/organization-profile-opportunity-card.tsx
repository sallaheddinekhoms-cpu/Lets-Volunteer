import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Calendar, Clock, Globe2, MoreVertical, Trash2, Lock, Edit } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OpportunityForCardList } from "@/types/opportunity";
import Link from "next/link";
import algerianWilayas from 'algeria-wilayas';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import Image from "next/image";

interface OpportunityCardProps {
  opportunity: OpportunityForCardList;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function OrganizationOpportunityCard({ opportunity, onEdit, onDelete }: OpportunityCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Helper function to get wilaya name from code
  const getWilayaName = (code: string) => {
    const wilaya = algerianWilayas.getWilayaByCode(code);
    return wilaya ? wilaya.name.arabic : code;
  };

  const handleDelete = () => {
    onDelete?.(opportunity.id);
    setShowDeleteDialog(false);
  };


  
  return (
    <>
      <Card className="group hover:shadow-xl text-right transition-all duration-300 overflow-hidden border-muted/20 hover:border-primary/20">
        {opportunity.image && (
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={opportunity.image}
                    alt={opportunity.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
              )}
        
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-primary tracking-tight hover:text-primary/80 transition-colors">
                  {opportunity.title}
                </h3>
                {(onEdit || onDelete) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/opportunities/${opportunity.id}/edit`}>
                        <DropdownMenuItem>
                          <Edit className="ml-2 h-4 w-4" />
                          تعديل الفرصة
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(opportunity.id)}>
                          <Lock className="ml-2 h-4 w-4" />
                          {opportunity.is_available ? "إغلاق الفرصة" : "فتح الفرصة"}
                        </DropdownMenuItem>
                      )}
                      {(onEdit || onDelete) && <DropdownMenuSeparator />}
                      {onDelete && (
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setShowDeleteDialog(true)
                            handleDelete()
                          }}
                        >
                          <Trash2 className="ml-2 h-4 w-4" />
                          حذف الفرصة
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
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
                  {!opportunity.is_available ? "مغلق" : " متاح للتقديم"}
                </Badge>

                <Badge 
                  variant={!opportunity.is_active ? "outline" : "default"} 
                  className={cn(
                    "text-sm font-medium",
                    !opportunity.is_active ? "border-muted-foreground/50" : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                  )}
                >
                  {!opportunity.is_active ? "غير مفعل" : "مفعل"}
                </Badge>
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
        <CardFooter className="pt-2 flex flex-col gap-2">
          <Link className="w-full" href={`/opportunities/${opportunity.id}`} passHref>
            <Button 
              className="w-full text-white font-medium hover:opacity-90 transition-opacity bg-gradient-to-r from-primary to-primary/90"
            >
              عرض التفاصيل
            </Button>
          </Link>

          <Link className="w-full" href={`/opportunities/${opportunity.id}/participations`} passHref>
            <Button 
              className="w-full text-white font-medium hover:opacity-90 transition-opacity bg-gradient-to-r from-secondary to-primary/90"
            >
              عرض طلبات المشاركة
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف الفرصة التطوعية؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف جميع المعلومات المتعلقة بهذه الفرصة. هذا الإجراء لا يمكن التراجع عنه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف الفرصة
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}