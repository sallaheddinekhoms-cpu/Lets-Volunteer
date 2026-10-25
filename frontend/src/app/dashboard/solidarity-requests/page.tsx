"use client";

import React, { useState, useEffect } from "react";
import {
  PackageSearch,
  CheckCircle2,
  XCircle,
  Trash2,
  Phone,
  Share2,
  Calendar,
  AlertCircle,
  MapPin,
  Clock,
  Search,
  Filter,
  Check,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getAdminSolidarityRequests,
  updateSolidarityRequestStatus,
  deleteSolidarityRequest,
} from "@/data/admin/Solidarity";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface SolidarityRequest {
  id: string;
  requester_name: string;
  title: string;
  category: string;
  urgency: "normal" | "medium" | "urgent";
  urgency_display: string;
  description: string;
  wilaya: string;
  daira?: string;
  contact_phone: string;
  status: "pending" | "approved" | "rejected" | "fulfilled";
  status_display: string;
  admin_note?: string;
  created_at: string;
}

export default function AdminSolidarityRequestsPage() {
  const [requests, setRequests] = useState<SolidarityRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await getAdminSolidarityRequests(statusFilter);
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("فشل في تحميل طلبات المتجر");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionInProgress(id);
    try {
      await updateSolidarityRequestStatus(id, newStatus);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: newStatus as any,
                status_display:
                  newStatus === "approved"
                    ? "معتمد"
                    : newStatus === "rejected"
                    ? "مرفوض"
                    : "قيد المراجعة",
              }
            : r
        )
      );

      if (newStatus === "approved") {
        toast.success("تمت المصادقة على الطلب ونشره في متجر التطوع بنجاح! ✓");
      } else if (newStatus === "rejected") {
        toast.warning("تم رفض نشر الطلب.");
      } else {
        toast.info("تم تحديث حالة الطلب.");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("حدث خطأ أثناء تحديث حالة الطلب");
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب نهائياً من النظام؟")) return;

    setActionInProgress(id);
    try {
      await deleteSolidarityRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("تم حذف الطلب بنجاح");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("حدث خطأ أثناء محاولة حذف الطلب");
    } finally {
      setActionInProgress(null);
    }
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requester_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.wilaya.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold mb-1">
            <PackageSearch className="w-3.5 h-3.5" />
            إدارة متجر التطوع والتكافل
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            طلبات الاحتياج والمصادقة
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            مراجعة طلبات المواطنين والجمعيات الذين يبحثون عن مستلزمات طبية وتكافلية والمصادقة على نشرها للعموم.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/solidarity-store" target="_blank">
            <Button variant="outline" className="gap-2 text-xs">
              <ExternalLink className="w-3.5 h-3.5" />
              معاينة المتجر العام
            </Button>
          </Link>
          <Button
            onClick={fetchRequests}
            variant="ghost"
            size="icon"
            title="تحديث القائمة"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter("pending")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === "pending"
              ? "bg-amber-500/10 border-amber-500 text-amber-900"
              : "bg-card hover:bg-muted/50 border-border"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">قيد المراجعة (بحاجة لمصادقة)</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black mt-2 text-amber-600">{pendingCount}</p>
        </div>

        <div
          onClick={() => setStatusFilter("approved")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === "approved"
              ? "bg-emerald-500/10 border-emerald-500 text-emerald-900"
              : "bg-card hover:bg-muted/50 border-border"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">معتمدة ومنشورة في المتجر</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black mt-2 text-emerald-600">{approvedCount}</p>
        </div>

        <div
          onClick={() => setStatusFilter("rejected")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === "rejected"
              ? "bg-rose-500/10 border-rose-500 text-rose-900"
              : "bg-card hover:bg-muted/50 border-border"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">مرفوضة</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black mt-2 text-rose-600">{rejectedCount}</p>
        </div>

        <div
          onClick={() => setStatusFilter("all")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === "all"
              ? "bg-primary/10 border-primary text-primary"
              : "bg-card hover:bg-muted/50 border-border"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">إجمالي الطلبات</span>
            <Filter className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-black mt-2 text-foreground">{requests.length}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-card p-3 rounded-2xl border border-border flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
          <Input
            placeholder="ابحث باسم صاحب الطلب، الغرض، الولاية، أو التفاصيل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-9"
          />
        </div>
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="text-center py-24 text-muted-foreground">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
          جاري تحميل طلبات المتجر...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-dashed p-8">
          <PackageSearch className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-foreground">لا توجد طلبات تطابق الفلترة حالياً</h3>
          <p className="text-xs text-muted-foreground mt-1">
            عندما يقوم أي زائر بتقديم طلب لغرض لم يجده في المتجر، سيظهر هنا مباشرة للمراجعة.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className={`p-5 rounded-2xl border transition-all ${
                req.status === "pending"
                  ? "bg-amber-50/40 border-amber-200 dark:bg-amber-950/10 dark:border-amber-900/40"
                  : req.status === "approved"
                  ? "bg-card border-border hover:border-emerald-500/50"
                  : "bg-card border-border opacity-70"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                
                {/* Right: Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Badge */}
                    {req.status === "pending" && (
                      <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1 text-xs font-bold">
                        <Clock className="w-3 h-3" />
                        قيد المراجعة (بحاجة لمصادقة)
                      </Badge>
                    )}
                    {req.status === "approved" && (
                      <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        معتمد ومنشور في المتجر ✓
                      </Badge>
                    )}
                    {req.status === "rejected" && (
                      <Badge variant="destructive" className="gap-1 text-xs font-bold">
                        <XCircle className="w-3 h-3" />
                        مرفوض
                      </Badge>
                    )}

                    {/* Urgency Badge */}
                    <Badge
                      variant="outline"
                      className={
                        req.urgency === "urgent"
                          ? "border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/20 font-bold"
                          : req.urgency === "medium"
                          ? "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/20"
                          : "border-slate-400 text-slate-600"
                      }
                    >
                      درجة الإلحاح: {req.urgency_display || (req.urgency === "urgent" ? "عاجل جداً" : req.urgency === "medium" ? "متوسط" : "عادي")}
                    </Badge>

                    {/* Category */}
                    <span className="text-xs bg-muted px-2.5 py-0.5 rounded-md font-medium text-muted-foreground">
                      {req.category}
                    </span>

                    {/* Wilaya */}
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {req.wilaya} {req.daira ? `• ${req.daira}` : ""}
                    </span>

                    {/* Date */}
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mr-auto">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(req.created_at).toLocaleDateString("ar-DZ")}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground">
                    {req.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-foreground/85 leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/40">
                    {req.description}
                  </p>

                  {/* Requester Contact Info */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground pt-1">
                    <span className="text-foreground font-bold">
                      صاحب الطلب: {req.requester_name}
                    </span>
                    <span className="flex items-center gap-1 text-primary font-bold">
                      <Phone className="w-3.5 h-3.5" />
                      هاتف: {req.contact_phone}
                    </span>
                  </div>
                </div>

                {/* Left: Action Buttons */}
                <div className="flex lg:flex-col items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 lg:border-r lg:pr-4">
                  {req.status !== "approved" && (
                    <Button
                      onClick={() => handleUpdateStatus(req.id, "approved")}
                      disabled={actionInProgress === req.id}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5 shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      مصادقة ونشر للعموم
                    </Button>
                  )}

                  {req.status === "approved" && (
                    <Button
                      onClick={() => handleUpdateStatus(req.id, "rejected")}
                      disabled={actionInProgress === req.id}
                      variant="outline"
                      className="w-full text-xs text-amber-700 border-amber-300 hover:bg-amber-50"
                    >
                      إلغاء النشر
                    </Button>
                  )}

                  {req.status === "pending" && (
                    <Button
                      onClick={() => handleUpdateStatus(req.id, "rejected")}
                      disabled={actionInProgress === req.id}
                      variant="outline"
                      className="w-full text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                    >
                      <XCircle className="w-3.5 h-3.5 ml-1" />
                      رفض الطلب
                    </Button>
                  )}

                  <div className="flex items-center gap-1 w-full">
                    <a
                      href={`tel:${req.contact_phone}`}
                      className="flex-1"
                    >
                      <Button variant="secondary" size="sm" className="w-full text-xs gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        اتصال
                      </Button>
                    </a>

                    <a
                      href={`https://wa.me/213${req.contact_phone.replace(/^0/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="icon" className="h-8 w-8 text-emerald-600" title="مراسلة واتساب">
                        <Share2 className="w-3.5 h-3.5" />
                      </Button>
                    </a>

                    <Button
                      onClick={() => handleDelete(req.id)}
                      disabled={actionInProgress === req.id}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-rose-600 hover:bg-rose-50"
                      title="حذف نهائي"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
