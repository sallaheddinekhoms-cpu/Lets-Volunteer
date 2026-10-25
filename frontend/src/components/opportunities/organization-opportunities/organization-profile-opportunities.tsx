"use client"

import React, { useState } from 'react'
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { OrganizationOpportunityCard } from './organization-profile-opportunity-card';
import { OpportunityForCardList } from '@/types/opportunity';
import { toast } from 'react-toastify';
import { deleteOpportunity, updateOpportunity } from '@/data/Opportunities';

const OrganizationProfileOpportunitiesSection = (
  { opportunities } : { opportunities: OpportunityForCardList[] }
) => {
  const [activeTab, setActiveTab] = useState("active");

  const activeOpportunities = opportunities.filter(opp => opp.is_active);
  const inactiveOpportunities = opportunities.filter(opp => !opp.is_active);

  const handleDelete = async (id: string) => {
    toast.promise(
      deleteOpportunity(id),
      {
        pending: "حذف الفرصة...",
        success: "تم حذف الفرصة بنجاح",
        error: "حدث خطأ أثناء حذف الفرصة"
      }
    )
  }

  const handleEdit = (id: string) => {
    toast.promise(
      updateOpportunity(id, { is_available: !activeOpportunities.find(opp => opp.id === id)?.is_available } ),
      {
        pending: "تعديل الفرصة...",
        success: "تم تعديل الفرصة بنجاح",
        error: "حدث خطأ أثناء تعديل الفرصة"
      }
      
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-primary">فرصي التطوعية</h2>
        <Link href="/profile/add-opportunity">
          <Button className="gap-2 text-white">
            <Plus className="h-5 w-5" />
            إضافة فرصة جديدة
          </Button>
        </Link>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6" dir="rtl">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
          <TabsTrigger 
            value="inactive" 
            className="text-lg"
            data-state={activeTab === "inactive" ? "active" : "inactive"}
            style={{
              backgroundColor: activeTab === "inactive" ? "rgba(220, 38, 38, 0.1)" : "",
              color: activeTab === "inactive" ? "rgb(220, 38, 38)" : "",
              borderColor: activeTab === "inactive" ? "rgb(220, 38, 38)" : ""
            }}
          >
            غير مفعل
          </TabsTrigger>
          <TabsTrigger 
            value="active" 
            className="text-lg"
            data-state={activeTab === "active" ? "active" : "inactive"}
            style={{
              backgroundColor: activeTab === "active" ? "rgba(22, 163, 74, 0.1)" : "",
              color: activeTab === "active" ? "rgb(22, 163, 74)" : "",
              borderColor: activeTab === "active" ? "rgb(22, 163, 74)" : ""
            }}
          >
            مفعل
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <OrganizationOpportunityCard opportunity={opportunity} onEdit={handleEdit} onDelete={handleDelete} />
              </motion.div>
            ))}
          </div>

          {activeOpportunities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                لا توجد فرص تطوعية مفعلة
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="inactive">
          <div dir="rtl" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactiveOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <OrganizationOpportunityCard opportunity={opportunity} onEdit={()=>{}} onDelete={handleDelete} />
              </motion.div>
            ))}
          </div>

          {inactiveOpportunities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                لا توجد فرص تطوعية غير مفعلة
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

export default OrganizationProfileOpportunitiesSection