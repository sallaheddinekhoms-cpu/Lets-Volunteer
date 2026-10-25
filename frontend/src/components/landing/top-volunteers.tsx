"use client";

import React, { useState, JSX } from "react";
import { motion, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Clock, MessageSquare, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";

// Types for our volunteer data
interface Volunteer {
  id: string;
  first_name: string;
  last_name: string;
  hours: number;
  comments?: string;
  rating: number; // Out of 5
}

interface TopVolunteersProps {
  weeklyVolunteers: Volunteer[];
  monthlyVolunteers: Volunteer[];
  allTimeVolunteers: Volunteer[];
}

interface VolunteerCardProps {
  volunteer: Volunteer;
  index: number;
  renderStarRating: (rating: number) => JSX.Element;
  getMedalColor: (index: number) => string;
  variants: Variants;
  lang: string;
  dir: string;
}

export default function TopVolunteersSection({
  weeklyVolunteers = [],
  monthlyVolunteers = [],
  allTimeVolunteers = [],
}: TopVolunteersProps) {
  const { lang, dir, t } = useLanguage();
  // Default to monthly tab
  const [activeTab, setActiveTab] = useState<string>("monthly");

  // Function to render star ratings
  const renderStarRating = (rating: number): JSX.Element => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < rating
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  // Function to get medal color based on position
  const getMedalColor = (index: number): string => {
    switch (index) {
      case 0:
        return "text-amber-400"; // Gold
      case 1:
        return "text-gray-400"; // Silver
      case 2:
        return "text-amber-700"; // Bronze
      default:
        return "text-primary/70"; // Default
    }
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="relative py-16 overflow-hidden" dir={dir}>
      {/* Background Gradient */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl" />

      {/* Floating animation elements */}
      <motion.div
        className="absolute bottom-20 right-20 text-secondary/10"
        animate={{
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Award size={90} />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-4 mb-12">
          <motion.div
            className="inline-block bg-primary/5 rounded-lg px-6 py-2 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary text-3xl sm:text-4xl font-extrabold">
              {t("volunteers.badge", "متطوعونا المميزون")}
            </span>
          </motion.div>
          <motion.h2
            className="text-lg md:text-xl font-bold text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {t("volunteers.title", "رواد العطاء وأبطال التطوع")}
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-base max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t(
              "volunteers.subtitle",
              "نحتفي بالشباب الأكثر نشاطاً وتأثيراً في الميدان تقديراً لجهودهم النبيلة"
            )}
          </motion.p>
        </div>

        <Tabs
          defaultValue="monthly"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
          dir={dir}
        >
          <div className="flex justify-center mb-8">
            <TabsList className="bg-primary/5 p-1 rounded-xl">
              <TabsTrigger
                value="weekly"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2 font-bold text-xs sm:text-sm"
              >
                {t("volunteers.weekly", "متطوعو الأسبوع")}
              </TabsTrigger>
              <TabsTrigger
                value="monthly"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2 font-bold text-xs sm:text-sm"
              >
                {t("volunteers.monthly", "متطوعو الشهر")}
              </TabsTrigger>
              <TabsTrigger
                value="allTime"
                className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2 font-bold text-xs sm:text-sm"
              >
                {t("volunteers.allTime", "رواد المنصة الدائمون")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="weekly">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {weeklyVolunteers.map((volunteer, index) => (
                <VolunteerCard
                  key={volunteer.id}
                  volunteer={volunteer}
                  index={index}
                  renderStarRating={renderStarRating}
                  getMedalColor={getMedalColor}
                  variants={itemVariants}
                  lang={lang}
                  dir={dir}
                />
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="monthly">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {monthlyVolunteers.map((volunteer, index) => (
                <VolunteerCard
                  key={volunteer.id}
                  volunteer={volunteer}
                  index={index}
                  renderStarRating={renderStarRating}
                  getMedalColor={getMedalColor}
                  variants={itemVariants}
                  lang={lang}
                  dir={dir}
                />
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="allTime">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {allTimeVolunteers.map((volunteer, index) => (
                <VolunteerCard
                  key={volunteer.id}
                  volunteer={volunteer}
                  index={index}
                  renderStarRating={renderStarRating}
                  getMedalColor={getMedalColor}
                  variants={itemVariants}
                  lang={lang}
                  dir={dir}
                />
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

// Separate component for each volunteer card
const VolunteerCard: React.FC<VolunteerCardProps> = ({
  volunteer,
  renderStarRating,
  variants,
  lang,
  dir,
}) => {
  return (
    <motion.div variants={variants} className="h-full" dir={dir}>
      <Card className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden border-muted/20 hover:border-primary/20 h-full">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-end mb-4">
            <div className={`space-y-1 ${dir === "rtl" ? "text-right" : "text-left"}`}>
              <h3 className="text-xl font-bold text-primary">
                {volunteer.first_name} {volunteer.last_name}
              </h3>
              <div className="flex items-center justify-start">
                {renderStarRating(volunteer.rating)}
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-2 flex-grow">
            <div className="flex items-center gap-2 justify-start">
              <Badge
                variant="secondary"
                className="bg-primary/10 hover:bg-primary/15 text-primary border-0"
              >
                {lang === "ar" ? "ساعات التطوع" : "Volunteer Hours"}
              </Badge>
              <Clock className="w-5 h-5 text-primary/70" />
              <div className="text-muted-foreground/90 text-lg font-semibold">
                {volunteer.hours}
              </div>
            </div>

            {volunteer.comments && (
              <div className="mt-4">
                <div
                  className={`flex items-center gap-2 ${
                    dir === "rtl" ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <span className="text-muted-foreground/90 text-sm">
                    {lang === "ar" ? "تعليق المنظمة" : "Organization Note"}
                  </span>
                  <MessageSquare className="w-4 h-4 text-primary/70" />
                </div>
                <p
                  className={`text-muted-foreground/80 ${
                    dir === "rtl" ? "text-right" : "text-left"
                  } bg-secondary/10 p-3 rounded-lg text-sm leading-relaxed`}
                >
                  &quot;{volunteer.comments}&quot;
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
