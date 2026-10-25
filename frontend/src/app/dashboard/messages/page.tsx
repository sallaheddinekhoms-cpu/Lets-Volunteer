"use client";

import React, { useState, useEffect } from "react";
import { Mail, Trash2, Reply, Copy, Search, RefreshCw, Calendar, User, Check, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";
import { getContactMessages, deleteContactMessage } from "@/data/admin/Contact";
import { Button } from "@/components/ui/button";

interface ContactMessage {
  id: number | string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const data = await getContactMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("فشل في تحميل رسائل التواصل");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: number | string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذه الرسالة نهائياً؟")) return;

    try {
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("تم حذف الرسالة بنجاح");
    } catch (error) {
      console.error("Delete message error:", error);
      toast.error("حدث خطأ أثناء محاولة حذف الرسالة");
    }
  };

  const copyEmail = (email: string, id: number | string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    toast.info("تم نسخ البريد الإلكتروني للحافظة");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredMessages = messages.filter((msg) => {
    const query = searchQuery.toLowerCase();
    return (
      msg.name?.toLowerCase().includes(query) ||
      msg.email?.toLowerCase().includes(query) ||
      msg.message?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 md:p-8 space-y-6" dir="rtl">
      
      {/* Page Title & Stats Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <MessageSquare className="w-4 h-4" />
            <span>لوحة تحكم الإدارة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            رسائل التواصل والمقترحات
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            إدارة ومراجعة الرسائل الواردة من استمارة «اتصل بنا» والتواصل المباشر مع أصحابها.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={fetchMessages}
            variant="outline"
            className="flex items-center gap-2 text-xs font-bold"
            disabled={isLoading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>تحديث</span>
          </Button>
          <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
            إجمالي الرسائل: {messages.length}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 max-w-md bg-white p-2 rounded-2xl border border-border shadow-sm">
        <Search className="w-4 h-4 text-muted-foreground ml-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث بالاسم، البريد الإلكتروني، أو نص الرسالة..."
          className="w-full text-xs sm:text-sm outline-none bg-transparent"
        />
      </div>

      {/* Messages List */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">جاري تحميل رسائل التواصل...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-border space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-muted-foreground flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-foreground">لا توجد رسائل تواصل مطابقة</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            ستظهر هنا كافة الرسائل والمقترحات التي يرسلها المواطنون والجمعيات عبر صفحة «اتصل بنا».
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Header info */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground">
                      {msg.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono" dir="ltr">
                      {msg.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {msg.created_at
                      ? new Date(msg.created_at).toLocaleString("ar-DZ", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "وصلت حديثاً"}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${msg.email}?subject=بخصوص رسالتك عبر منصة لنتطوع`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold transition-all shadow-sm"
                  >
                    <Reply className="w-3.5 h-3.5 ml-1" />
                    <span>رد عبر البريد</span>
                  </a>

                  <button
                    onClick={() => copyEmail(msg.email, msg.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 ml-1" />
                        <span className="text-emerald-700">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 ml-1" />
                        <span>نسخ البريد</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(msg.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-all"
                  title="حذف الرسالة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
