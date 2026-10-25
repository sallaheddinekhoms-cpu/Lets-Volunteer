"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, MessageSquare, ShieldCheck, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import { sendEmail } from "@/data/admin/Contact";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.warning("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    setIsSubmitting(true);
    try {
      await toast.promise(sendEmail(formData), {
        pending: "جاري إرسال رسالتك إلى إدارة المنصة...",
        success: "تم إرسال رسالتك بنجاح! سيتم مراجعتها من قِبل إدارة المنصة والرد عليك.",
        error: "حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً.",
      });

      setFormData({ name: "", email: "", message: "" });
      setIsSent(true);
    } catch (error) {
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-16" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>قنوات التواصل المباشرة</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground">
            اتصل بإدارة{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#17B2A8] to-primary">
              منصة لنتطوع
            </span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            نحن هنا للاستماع إلى مقترحاتكم، الإجابة على تساؤلاتكم، وتنسيق المبادرات التطوعية مع الجمعيات والمتطوعين في كافة أنحاء الوطن.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Info Side (5 cols) */}
          <motion.div
            className="lg:col-span-5 space-y-6 text-right"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-foreground pb-2 border-b border-border">
                معلومات التواصل الرسمية
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground">البريد الإلكتروني للإدارة</h4>
                    <a href="mailto:contact@lets-volunteer-dz.org" className="text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors">
                      contact@lets-volunteer-dz.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#17B2A8]/10 text-[#17B2A8] flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground">الهاتف ومركز التنسيق</h4>
                    <p className="text-sm sm:text-base font-bold text-foreground" dir="ltr">
                      +213 555 123 456
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground">التغطية الميدانية</h4>
                    <p className="text-sm font-bold text-foreground">
                      المقر الإداري وسطيف • تغطية وطنية تشمل الـ 58 ولاية
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground">سرعة الاستجابة</h4>
                    <p className="text-sm font-bold text-foreground">
                      مراجعة الرسائل والرد خلال 24 ساعة عمل
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Safety Badge */}
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
              <p className="text-xs leading-relaxed">
                <strong>حماية البيانات مكفولة:</strong> تخضع كافة المراسلات لسرية تامة وتُعالج وفقاً لمقتضيات القانون رقم 18-07 المتعلق بحماية المعطيات ذات الطابع الشخصي.
              </p>
            </div>
          </motion.div>

          {/* Form Side (7 cols) */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-border shadow-xl text-right">
              <h2 className="text-2xl font-extrabold text-foreground mb-2">
                أرسل رسالة أو مقترحاً
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mb-8">
                املأ النموذج وسيقوم المشرف الإداري للمنصة بالاطلاع على رسالتك والتواصل معك عبر البريد الإلكتروني.
              </p>

              {isSent ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-900">تم استلام رسالتك بنجاح!</h3>
                  <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
                    شكراً لتواصلك مع منصة «لنتطوع». تم تسجيل مراسلتك في لوحة تحكم إدارة المنصة وسنتواصل معك قريباً.
                  </p>
                  <Button
                    onClick={() => setIsSent(false)}
                    variant="outline"
                    className="border-emerald-600 text-emerald-700 hover:bg-emerald-100 mt-2"
                  >
                    إرسال رسالة أخرى
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-2">
                      الاسم الكامل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="مثال: يوسف العربي"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50/50 text-foreground text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-2">
                      البريد الإلكتروني للتواصل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50/50 text-foreground text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-left"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-2">
                      تفاصيل الرسالة أو المقترح <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="اكتب رسالتك، استفسارك، أو مقترحك بالتفصيل هنا..."
                      className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50/50 text-foreground text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all resize-none leading-relaxed"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-[#105D56]/90 text-white py-6 rounded-xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة إلى إدارة المنصة"}</span>
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
