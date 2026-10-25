"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  LineChart, 
  Briefcase,
  CreditCard
} from "lucide-react";
import PersonalVolunteerInfo from "@/app/profile/_volunteer/volunteer-sections/personal-volunteer-info";
import { Skill, Volunteer } from "@/types";
import { VolunteerOpportunitiesSection } from "./volunteer-sections/opportunities-volunteer-info";
import { ParticipationForVolunteer } from "@/types/participation";
import VolunteerCardSection from "./volunteer-sections/volunteer-card-section";
import VolunteerStatsSection from "./volunteer-sections/volunteer-stats-section";

interface VolunteerSectionsProps {
  volunteer: Volunteer;
  participations: ParticipationForVolunteer[];
  skills: Skill[];
  stats: any
}

export default function VolunteerSections({ volunteer, participations, skills , stats}: VolunteerSectionsProps) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          dir="rtl" 
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 gap-2 w-full max-w-3xl mx-auto bg-muted p-1 rounded-xl mb-6">
            <TabsTrigger 
              value="profile" 
              className="flex items-center justify-center gap-2 rounded-lg p-2 transition-colors data-[state=active]:bg-background data-[state=active]:shadow"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">الملف الشخصي</span>
            </TabsTrigger>
            <TabsTrigger 
              value="opportunities" 
              className="flex items-center justify-center gap-2 rounded-lg p-2 transition-colors data-[state=active]:bg-background data-[state=active]:shadow"
            >
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">الفرص</span>
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="flex items-center justify-center gap-2 rounded-lg p-2 transition-colors data-[state=active]:bg-background data-[state=active]:shadow"
            >
              <LineChart className="h-4 w-4" />
              <span className="hidden sm:inline">الإحصائيات</span>
            </TabsTrigger>
           
            <TabsTrigger 
              value="card" 
              className="flex items-center justify-center gap-2 rounded-lg p-2 transition-colors data-[state=active]:bg-background data-[state=active]:shadow"
            >
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">بطاقة</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="w-full">
            <PersonalVolunteerInfo skills={skills} volunteer={volunteer} />
          </TabsContent>
          <TabsContent value="opportunities" className="w-full">
            <VolunteerOpportunitiesSection participations={participations} />
          </TabsContent>
          <TabsContent value="stats" className="w-full">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">الإحصائيات</h2>
              <VolunteerStatsSection stats={stats} />
            </Card>
          </TabsContent>
         
          <TabsContent value="card" className="w-full">
            <VolunteerCardSection volunteer={volunteer} stats={stats} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}