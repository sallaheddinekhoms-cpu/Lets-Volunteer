"use client"

import type React from "react"
import { useTransition, useEffect } from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin, Calendar, Save, X } from "lucide-react"
import type { Skill, Volunteer } from "@/types"
import { logout } from "@/actions/logout"
import { useRouter } from "next/navigation"
import { updateVolunteerProfile } from "@/data/Volunteer"
import { toast } from "react-toastify"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import algerianWilayas, { type Daira } from "algeria-wilayas"
import { SimpleDateInput } from "@/components/ui/custom/simple-date-input"

interface PersonalVolunteerInfosProps {
  volunteer: Volunteer
  skills: Skill[]
}

const PersonalVolunteerInfo = ({ volunteer, skills }: PersonalVolunteerInfosProps) => {
  console.log("Volunteer avatar URL:", volunteer.avatar) 
  const [profileData, setProfileData] = useState(volunteer)
  const [isPending, startTransition] = useTransition()
  const [dairas, setDairas] = useState<Daira[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  const router = useRouter()

  const blood_types = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  const wilayas = algerianWilayas.getAllWilayas()

  useEffect(() => {
    if (volunteer) {
      setProfileData(volunteer)
    }
  }, [volunteer])

  useEffect(() => {
    setDairas(algerianWilayas.getDairasByWilaya(profileData.wilaya ?? "") || [])
  }, [profileData.wilaya])

  const handleLogout = () => {
    startTransition(() => {
      logout().then(() => router.push("/"))
    })
  }

  const handleSave = async () => {
    setIsSaving(true)

    toast
      .promise(updateVolunteerProfile(volunteer.id, profileData), {
        pending: "جاري تحديث البيانات...",
        success: "تم تحديث البيانات بنجاح",
        error: "حدث خطأ أثناء تحديث البيانات",
      })
      .finally(() => {
        setIsSaving(false)
        setIsEditing(false)
      })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileData({ ...profileData, avatar: file })
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Improved skills management
  const handleAddSkill = (skillId: string) => {
    // Check if skill already exists in profile
    const skillExists = profileData.skills?.some((s) => s.skill.id === skillId)

    if (!skillExists) {
      const skillToAdd = skills.find((s) => s.id === skillId)
      if (skillToAdd) {
        setProfileData({
          ...profileData,
          skills: [...(profileData.skills || []), { skill: skillToAdd }],
        })
      }
    }
  }

  const handleRemoveSkill = (skillId: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills?.filter((s) => s.skill.id !== skillId),
    })
  }

  return (
    <Card className="p-6 shadow-md border border-primary/10 bg-gradient-to-b from-white to-primary/5">
      <div className="flex flex-col lg:flex-row gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center space-y-4 bg-white/50 p-6 rounded-lg shadow-sm"
          dir="rtl"
        >
          <Avatar className="w-32 h-32 border-2 border-primary/20 shadow-md transition-all duration-300 hover:scale-105">
            <AvatarImage src={imagePreview || (typeof volunteer.avatar === "string" ? volunteer.avatar : undefined)} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {profileData.first_name?.[0]}
              {profileData.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="transition-all duration-200 hover:bg-primary/10 hover:border-primary"
            >
              تعديل الملف الشخصي
            </Button>
          ) : (
            <div className="w-full">
              <Label htmlFor="avatar" className="block mb-2 text-center">
                تغيير الصورة
              </Label>
              <Input
                type="file"
                id="avatar"
                onChange={handleImageChange}
                className="border-primary/20 focus:border-primary"
              />
            </div>
          )}

          <Button
            disabled={isPending || isEditing}
            variant="ghost"
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
          >
            {isPending ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
          </Button>
        </motion.div>

        <div className="flex-1 space-y-6 bg-white/70 p-6 rounded-lg shadow-sm" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>الاسم الأول</Label>
              <Input
                disabled={!isEditing}
                value={profileData.first_name ?? "غير محدد"}
                onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                className="border-primary/20 focus:border-primary transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label>اللقب</Label>
              <Input
                disabled={!isEditing}
                value={profileData.last_name ?? "غير محدد"}
                onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                className="border-primary/20 focus:border-primary transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                البريد الإلكتروني
              </Label>
              <Input disabled value={profileData.email ?? "غير محدد"} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                رقم الهاتف
              </Label>
              <Input
                disabled={!isEditing}
                value={profileData.phone_number ?? "غير محدد"}
                onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                maxLength={10}
                className="border-primary/20 focus:border-primary transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                الولاية
              </Label>
{!isEditing ? (
                <Input
                  disabled={true}
                  value={
                    profileData.wilaya
                      ? wilayas.find((w) => w.code === profileData.wilaya)?.name.arabic || profileData.wilaya
                      : "غير محدد"
                  }
                  className="border-primary/20"
                />
              ) : (
                <Select
                  disabled={!isEditing}
                  value={profileData.wilaya ?? ""}
                  onValueChange={(value) => {
                    // Reset daira when wilaya changes
                    setProfileData({ ...profileData, wilaya: value, daira: "" })
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue className="bg-transparent" placeholder="حدد ولايتك" />
                  </SelectTrigger>
                  <SelectContent>
                    {wilayas.map((wilaya) => (
                      <SelectItem key={wilaya.code} value={wilaya.code}>
                        {wilaya.name.arabic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                الدائرة
              </Label>
{!isEditing ? (
                <Input
                  disabled={true}
                  value={profileData.daira || "غير محدد"}
                  className="border-primary/20"
                />
              ) : (
                <Select
                  disabled={!isEditing}
                  value={profileData.daira ?? ""}
                  onValueChange={(value) => setProfileData({ ...profileData, daira: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue className="bg-transparent" placeholder="حدد الدائرة المقيم بها" />
                  </SelectTrigger>
                  <SelectContent>
                    {dairas.map((daira) => (
                      <SelectItem key={daira.id} value={daira.name.arabic}>
                        {daira.name.arabic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                تاريخ الميلاد
              </Label>
              <SimpleDateInput
                id="date_of_birth"
                value={profileData.date_of_birth ? new Date(profileData.date_of_birth) : undefined}
                onChange={(date) =>
                  setProfileData({
                    ...profileData,
                    date_of_birth: date ? date.toISOString().split("T")[0] : "",
                  })
                }
                disabled={!isEditing}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                الزمرة الدموية
              </Label>
              <Select
                disabled={!isEditing}
                value={profileData.blood_group ?? ""}
                onValueChange={(value) => setProfileData({ ...profileData, blood_group: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue className="bg-transparent" placeholder="حدد زمرتك الدموية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {blood_types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2 bg-white/50 p-4 rounded-lg">
              <Label className="text-lg font-medium">المهارات</Label>
              {isEditing ? (
                <div className="space-y-3">
                  <Select disabled={!isEditing} onValueChange={handleAddSkill}>
                    <SelectTrigger className="w-full border-primary/20 focus:border-primary">
                      <SelectValue className="bg-transparent" placeholder="اضف مهارة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {skills.map((skill) => (
                          <SelectItem key={skill.id} value={skill.id}>
                            {skill.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileData.skills?.map((skillItem) => (
                      <motion.span
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={skillItem.skill.id}
                        className="bg-primary text-white rounded-full px-3 py-1 flex items-center shadow-sm transition-all duration-200 hover:bg-primary/90"
                      >
                        {skillItem.skill.name}
                        <X
                          className="w-4 h-4 ml-1 cursor-pointer hover:text-white/80"
                          onClick={() => handleRemoveSkill(skillItem.skill.id)}
                        />
                      </motion.span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.skills?.length ? (
                    profileData.skills.map((skillItem) => (
                      <span key={skillItem.skill.id} className="bg-primary text-white rounded-full px-3 py-1 shadow-sm">
                        {skillItem.skill.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground italic">لا توجد مهارات</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-primary/10">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
              >
                إلغاء
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-white transition-colors duration-200"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 ml-2" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default PersonalVolunteerInfo
