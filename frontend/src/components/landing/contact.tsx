"use client";

import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { sendEmail } from "@/data/admin/Contact";
import { useLanguage } from "@/context/LanguageContext";

const ContactSection = () => {
  const { lang, dir, t } = useLanguage();
  const [subject_mail, setSubjectMail] = React.useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSubjectMail({ ...subject_mail, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pendingText = lang === "ar" ? "جاري إرسال الرسالة..." : "Sending message...";
    const successText = lang === "ar" ? "تم إرسال الرسالة بنجاح" : "Message sent successfully";
    const errorText = lang === "ar" ? "حدث خطأ أثناء إرسال الرسالة" : "Error sending message";

    toast
      .promise(sendEmail(subject_mail), {
        pending: pendingText,
        success: successText,
        error: errorText,
      })
      .then(() => {
        setSubjectMail({
          name: "",
          email: "",
          message: "",
        });
      })
      .catch((error) => {
        console.error("Failed to send email:", error);
      });
  };

  return (
    <section dir={dir} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              {t("contact.title", "تواصل معنا")}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              {t("contact.subtitle", "نحن هنا للإجابة على استفساراتكم وسماع اقتراحاتكم")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-0.5">
                    {lang === "ar" ? "اتصل بنا" : "Call Us"}
                  </h3>
                  <p className="text-muted-foreground text-base">+213 555 123 456</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-0.5">
                    {lang === "ar" ? "راسلنا" : "Email Us"}
                  </h3>
                  <p className="text-muted-foreground text-base">contact@lets-volunteer-dz.org</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold mb-0.5">
                    {lang === "ar" ? "مقر المنصة" : "Platform Headquarters"}
                  </h3>
                  <p className="text-muted-foreground text-base">
                    {lang === "ar" ? "الجزائر العاصمة / سطيف" : "Algiers / Setif, Algeria"}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  name="name"
                  value={subject_mail.name}
                  onChange={handleChange}
                  placeholder={t("contact.namePlaceholder", "الاسم الكامل")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-sm outline-none"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={subject_mail.email}
                  onChange={handleChange}
                  placeholder={t("contact.emailPlaceholder", "البريد الإلكتروني")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-sm outline-none"
                  required
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={subject_mail.message}
                  onChange={handleChange}
                  placeholder={t("contact.messagePlaceholder", "رسالتك واستفسارك")}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary text-sm outline-none"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white px-6 py-3.5 rounded-xl text-base font-bold hover:bg-primary/90 transition-all shadow-md"
              >
                {t("contact.send", "إرسال الرسالة")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
