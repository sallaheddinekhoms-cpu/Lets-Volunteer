"use client";

import { motion } from "framer-motion";
import { Heart, Users, Target, CheckCircle2, ArrowLeft, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const features = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "ربط المتطوعين بالجمعيات",
    description: "تسهيل الوصول إلى الفرص التطوعية والمشاركة في الأنشطة الخيرية"
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "تنسيق بين الجمعيات",
    description: "تمكين الهيئات غير الربحية من تنظيم جهودها وتحسين إدارة الموارد"
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "إدارة النشاطات الاجتماعية",
    description: "توفير أدوات لإدارة حملات النشاطات الاجتماعية وتوزيعها بشفافية وكفاءة"
  }
];

const reasons = [
  "أول منصة رقمية من نوعها في الجزائر",
  "واجهة سهلة الاستخدام ومتاحة للجميع",
  "تعزيز العمل الجماعي والتعاون بين الجهات الخيرية",
  "توفير بيانات دقيقة لتحسين توزيع النشاطات الاجتماعية"
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gray-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center space-y-6"
            {...fadeIn}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-24 h-24 mx-auto mb-8"
            >
              <Image
                src="/black_logo.svg"
                alt="لنتطوع"
                width={96}
                height={96}
                className="object-contain"
              />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
              حول المنصة
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              أول منصة رقمية في الجزائر تهدف إلى ربط الجمعيات الخيرية بالمتطوعين
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Policy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            {...fadeIn}
          >
            <h2 className="text-3xl font-bold text-primary mb-8">سياسة الخصوصية</h2>
            <div className="max-w-3xl mx-auto">
              <motion.div
                className="bg-gray-50 rounded-xl p-8 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-lg text-muted-foreground leading-relaxed text-right mb-6">
                  تخضع منصة لنتطوع للقانون رقم 18-07 المتعلق بحماية الأشخاص الطبيعية في مجال معالجة المعطيات ذات الطابع الشخصي
                </p>
                <div className="flex justify-center">
                  <a
                    href="/قانون حماية المعطيات الشخصية.pdf"
                    download
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-lg transition-colors duration-300 group"
                  >
                    <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    الاطلاع على القانون 18-07
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="space-y-6 text-right"
              {...fadeIn}
            >
              <h2 className="text-3xl font-bold text-primary">من نحن؟</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                هي أول منصة رقمية في الجزائر تهدف إلى ربط الجمعيات الخيرية بالمتطوعين، وتوفير بيئة متكاملة لتنسيق الجهود بين الهيئات غير الربحية لتقديم النشاطات الاجتماعية بأفضل طريقة ممكنة.
              </p>
            </motion.div>
            <motion.div 
              className="space-y-6 text-right"
              {...fadeIn}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-primary">مهمتنا</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                نؤمن بأن العمل الخيري أكثر تأثيرًا عندما يكون منظمًا وسهل الوصول، لذا نوفر أدوات رقمية للتواصل، التنسيق، والإدارة الفعالة بين الجهات الفاعلة في المجال الإنساني.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            {...fadeIn}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">ما الذي نقدمه؟</h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <div className="text-primary">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3 text-right">{feature.title}</h3>
                <p className="text-muted-foreground text-right">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            {...fadeIn}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">لماذا نحن؟</h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-end gap-4 bg-primary/5 p-6 rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                
                <p className="text-lg text-right">{reason}</p>
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            className="space-y-8"
            {...fadeIn}
          >
            <h2 className="text-3xl font-bold text-primary">
              انضم إلينا اليوم وساهم في صنع فرق حقيقي في المجتمع!
            </h2>
            <div>
              <Link href="/auth">
                <Button 
                  variant="default"
                  size="lg"
                  className="text-white bg-primary hover:bg-primary/90 text-lg px-8 py-6 rounded-xl font-medium transition-all duration-300 group"
                >
                  شارك معنا الآن
                  <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}