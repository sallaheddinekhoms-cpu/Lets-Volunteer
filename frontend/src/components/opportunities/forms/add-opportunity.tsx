"use client"

import type React from "react"
import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type * as z from "zod"
import { motion } from "framer-motion"
import { Plus, Minus, ArrowLeft, Upload, MapPin, Sparkles, PhoneCall, UserPlus } from "lucide-react"
import { useEffect } from "react"
import { getResponsibilityTemplates, getOrganizationContacts, createOrganizationContact } from "@/data/ExtendedData"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import BackgroundDecorations from "@/components/background-decorations"
import { opportunitySchema } from "@/schema/OpportunitySchema"
import type { Category } from "@/types"
import { addOpportunity } from "@/data/Opportunities"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { RTLDateInput } from "@/components/ui/custom/rtl-date-input"
import { format } from "date-fns"
import algerianWilayas from 'algeria-wilayas';
import LocationPickerWrapper from "./location-picker-wrapper"

export type OpportunityFormData = z.infer<typeof opportunitySchema>

interface AddOpportunityFormProps {
      categories: Category[]
      organizations?: Array<{ id: string; organization_name: string }>
      redirectUrl?: string
}

const AddOpportunityForm: React.FC<AddOpportunityFormProps> = ({ categories, organizations, redirectUrl }) => {
      const [selectedOrgId, setSelectedOrgId] = useState<string>("")
      const [selectedWilaya, setSelectedWilaya] = useState<string>("")
      const [templates, setTemplates] = useState<Array<{ id: number; title: string; category?: string }>>([])
      const [contacts, setContacts] = useState<Array<{ id: number; contact_name: string; phone_number: string; role_title?: string; is_primary?: boolean }>>([])
      const [selectedContactId, setSelectedContactId] = useState<string>("manual")
      const [showAddContact, setShowAddContact] = useState(false)
      const [newContactName, setNewContactName] = useState("")
      const [newContactPhone, setNewContactPhone] = useState("")
      const [newContactRole, setNewContactRole] = useState("")
      const [isAddingContact, setIsAddingContact] = useState(false)
      const [isLocating, setIsLocating] = useState(false)

      useEffect(() => {
            getResponsibilityTemplates().then((res) => {
                  if (Array.isArray(res) && res.length > 0) {
                        setTemplates(res)
                  }
            })
            getOrganizationContacts().then((res) => {
                  if (Array.isArray(res) && res.length > 0) {
                        setContacts(res)
                  }
            })
      }, [])

      const handleGetLocation = () => {
            if (!navigator.geolocation) {
                  toast.error("المتصفح لا يدعم تحديد الموقع الجغرافي")
                  return
            }
            setIsLocating(true)
            navigator.geolocation.getCurrentPosition(
                  (pos) => {
                        setValue("latitude", pos.coords.latitude, { shouldValidate: true })
                        setValue("longitude", pos.coords.longitude, { shouldValidate: true })
                        setIsLocating(false)
                        toast.success("تم تحديد إحداثيات موقعك الجغرافي بدقة!")
                  },
                  () => {
                        setIsLocating(false)
                        toast.warn("تعذر الحصول على إحداثيات GPS تلقائياً. يمكنك إدخالها يدوياً.")
                  }
            )
      }

      const handleAddTemplate = (title: string) => {
            const current = watch("responsabilities")
            if (current.length === 1 && (!current[0].title || current[0].title.trim() === "")) {
                  setValue("responsabilities.0.title", title, { shouldValidate: true })
            } else {
                  appendResponsability({ title })
            }
            toast.info(`تمت إضافة: "${title}"`)
      }

      const handleSaveNewContact = async () => {
            if (!newContactName.trim() || !newContactPhone.trim()) {
                  toast.error("يرجى ملء اسم الشخص ورقم الهاتف")
                  return
            }
            setIsAddingContact(true)
            const res = await createOrganizationContact({
                  contact_name: newContactName,
                  phone_number: newContactPhone,
                  role_title: newContactRole,
            })
            setIsAddingContact(false)
            if (res.status === 201 || res.status === 200) {
                  toast.success("تم حفظ جهة الاتصال بنجاح!")
                  const updated = [...contacts, res.data]
                  setContacts(updated)
                  setSelectedContactId(String(res.data.id))
                  setValue("phone_number", res.data.phone_number, { shouldValidate: true })
                  setNewContactName("")
                  setNewContactPhone("")
                  setNewContactRole("")
                  setShowAddContact(false)
            } else {
                  toast.error("فشل حفظ جهة الاتصال")
            }
      }

      const wilayas = algerianWilayas.getAllWilayas();
      const dairas = algerianWilayas.getDairasByWilaya(selectedWilaya);

      const {
            register,
            control,
            handleSubmit,
            setValue,
            formState: { errors, isSubmitting },
            watch,
      } = useForm<OpportunityFormData>({
            resolver: zodResolver(opportunitySchema),
            defaultValues: {
                  title: "",
                  description: "",
                  category: "",
                  duration: undefined,
                  date_of_opportunity: undefined,
                  is_urgent: false,
                  is_remote: false,
                  is_available: true,
                  wilaya: "",
                  daira: "",
                  phone_number: "",
                  email: "",
                  responsabilities: [{ title: "" }],
                  qualifications: [{ title: "" }],
            },
      })

      const {
            fields: responsabilityFields,
            append: appendResponsability,
            remove: removeResponsability,
      } = useFieldArray({
            control,
            name: "responsabilities",
      })

      const {
            fields: qualificationFields,
            append: appendQualification,
            remove: removeQualification,
      } = useFieldArray({
            control,
            name: "qualifications",
      })

      const [imagePreview, setImagePreview] = useState<string>("")
      const router = useRouter()

      const onError = (fieldErrors: any) => {
            console.error("Form validation errors:", fieldErrors)
            const keys = Object.keys(fieldErrors)
            if (keys.length > 0) {
                  const firstKey = keys[0]
                  const firstErr = fieldErrors[firstKey]
                  const message =
                        firstErr?.message ||
                        firstErr?.root?.message ||
                        (Array.isArray(firstErr) ? firstErr[0]?.title?.message : null) ||
                        "يرجى التأكد من ملء جميع الحقول المطلوبة بشكل صحيح"
                  toast.error(typeof message === "string" ? message : "يرجى التحقق من صحة البيانات المدخلة")
            }
      }

      const onSubmit = async (data: OpportunityFormData) => {
            try {
                  const formData = new FormData()

                  // Add basic fields
                  formData.append("title", data.title)
                  formData.append("description", data.description)
                  formData.append("is_urgent", String(data.is_urgent))
                  formData.append("is_remote", String(data.is_remote))
                  formData.append("is_available", String(data.is_available))
                  formData.append(
                        "date_of_opportunity",
                        data.date_of_opportunity ? format(data.date_of_opportunity, "yyyy-MM-dd") : "",
                  )
                  formData.append("category", data.category)
                  formData.append("duration", String(data.duration))
                  formData.append("wilaya", data.wilaya)
                  formData.append("daira", data.daira)
                  if (data.latitude) {
                        formData.append("latitude", String(data.latitude))
                  }
                  if (data.longitude) {
                        formData.append("longitude", String(data.longitude))
                  }
                  formData.append("phone_number", data.phone_number)
                  formData.append("email", data.email)

                  // Handle image if present
                  if (data.image) {
                        formData.append("image", data.image)
                  }

                  if (selectedOrgId) {
                        formData.append("organization", selectedOrgId)
                  }

                  // Handle nested arrays
                  data.responsabilities.forEach((resp, index) => {
                        const title = Array.isArray(resp.title) ? resp.title[0] : resp.title
                        formData.append(`responsabilities[${index}][title]`, title)
                  })

                  data.qualifications.forEach((qual, index) => {
                        const title = Array.isArray(qual.title) ? qual.title[0] : qual.title
                        formData.append(`qualifications[${index}][title]`, title)
                  })

                  const addPromise = addOpportunity(formData).then((result) => {
                        if (result.status === 201 || result.status === 200) {
                              router.push(redirectUrl || "/opportunities");
                              return result;
                        } else {
                              const errData = result?.data as any;
                              let msg = "فشل في إضافة الفرصة التطوعية";
                              if (errData?.detail) {
                                    msg = errData.detail;
                              } else if (typeof errData === "object" && errData !== null) {
                                    const entries = Object.entries(errData);
                                    if (entries.length > 0) {
                                          const [field, val] = entries[0];
                                          const txt = Array.isArray(val) ? val[0] : String(val);
                                          msg = `${field}: ${txt}`;
                                    }
                              }
                              throw new Error(msg);
                        }
                  }).catch((error) => {
                        if (error?.message) {
                              throw error;
                        }
                        throw new Error("حدث خطأ في الاتصال بالخادم أثناء نشر الفرصة");
                  });

                  toast.promise(addPromise, {
                        pending: "جاري نشر الفرصة التطوعية...",
                        success: "تم نشر الفرصة التطوعية بنجاح!",
                        error: {
                              render({ data }) {
                                    return (data as Error)?.message || "حدث خطأ أثناء إضافة الفرصة التطوعية";
                              }
                        }
                  })
            } catch (error) {
                  console.error("Submit exception:", error)
            }
      }

      const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (file) {
                  setValue("image", file, { shouldValidate: true })
                  const reader = new FileReader()
                  reader.onloadend = () => {
                        setImagePreview(reader.result as string)
                  }
                  reader.readAsDataURL(file)
            }
      }

      return (
            <div className="relative min-h-screen bg-background/50" dir="rtl">
                  <BackgroundDecorations>
                        <div className="container lg:w-1/2 mx-auto px-4 py-8 relative z-10">
                              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                                    <div className="text-center space-y-4">
                                          <div className="inline-block bg-primary/5 rounded-lg px-6 py-2 mb-4">
                                                <span className="text-primary font-medium">إضافة فرصة تطوع جديدة</span>
                                          </div>
                                          <h1 className="text-4xl font-bold text-primary">شارك فرصتك التطوعية</h1>
                                          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                                أضف تفاصيل الفرصة التطوعية وساهم في نشر ثقافة العمل التطوعي
                                          </p>
                                    </div>
                              </motion.div>

                              <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">
                                    <Card>
                                          <CardHeader>
                                                <CardTitle>المعلومات الأساسية</CardTitle>
                                                <CardDescription>أدخل المعلومات الأساسية للفرصة التطوعية</CardDescription>
                                          </CardHeader>
                                          <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                      {organizations && organizations.length > 0 && (
                                                            <div className="space-y-1.5 p-3.5 bg-muted/40 rounded-xl border border-border/60">
                                                                  <Label htmlFor="organization" className="text-xs font-bold text-foreground">الهيئة أو المنظمة المسؤولة عن الفرصة *</Label>
                                                                  <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                                                                        <SelectTrigger className="bg-card">
                                                                              <SelectValue placeholder="اختر الهيئة (أو اتركها لمبادرة المنصة الوطنية)" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                              {organizations.map((org) => (
                                                                                    <SelectItem key={org.id} value={org.id}>
                                                                                          {org.organization_name}
                                                                                    </SelectItem>
                                                                              ))}
                                                                        </SelectContent>
                                                                  </Select>
                                                            </div>
                                                      )}
                                                      <div>
                                                            <Label htmlFor="title">عنوان الفرصة <span className="text-destructive">*</span></Label>
                                                            <Input id="title" placeholder="أدخل عنوان الفرصة التطوعية" {...register("title")} />
                                                            {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
                                                      </div>

                                                      <RTLDateInput
                                                            id="date_of_opportunity"
                                                            label="تاريخ الفرصة *"
                                                            onChange={(date) => setValue("date_of_opportunity", date as Date, { shouldValidate: true, shouldDirty: true })}
                                                            error={errors.date_of_opportunity?.message}
                                                      />

                                                      <div>
                                                            <Label htmlFor="description">وصف الفرصة <span className="text-destructive">*</span></Label>
                                                            <Textarea
                                                                  id="description"
                                                                  placeholder="اشرح تفاصيل الفرصة التطوعية (20 حرفاً على الأقل)"
                                                                  className="h-32"
                                                                  {...register("description")}
                                                            />
                                                            {errors.description && (
                                                                  <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
                                                            )}
                                                      </div>

                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                            <div>
                                                                  <Label htmlFor="category">التصنيف <span className="text-destructive">*</span></Label>
                                                                  <Select
                                                                        value={watch("category")}
                                                                        onValueChange={(value) => {
                                                                              setValue("category", value, {
                                                                                    shouldValidate: true,
                                                                                    shouldDirty: true,
                                                                              });
                                                                        }}
                                                                  >
                                                                        <SelectTrigger>
                                                                              <SelectValue placeholder="اختر التصنيف" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                              {categories.map((category) => (
                                                                                    <SelectItem key={category.id} value={String(category.id)}>
                                                                                          {category.label}
                                                                                    </SelectItem>
                                                                              ))}
                                                                        </SelectContent>
                                                                  </Select>
                                                                  {errors.category && <p className="text-destructive text-sm mt-1">{errors.category.message}</p>}
                                                            </div>

                                                            <div>
                                                                  <Label htmlFor="duration">المدة (بالأيام) <span className="text-destructive">*</span></Label>
                                                                  <Input
                                                                        id="duration"
                                                                        type="number"
                                                                        min="1"
                                                                        max="30"
                                                                        placeholder="أدخل مدة الفرصة"
                                                                        {...register("duration", { valueAsNumber: true })}
                                                                  />
                                                                  {errors.duration && <p className="text-destructive text-sm mt-1">{errors.duration.message}</p>}
                                                            </div>
                                                      </div>

                                                      <div className="flex flex-col gap-4 pt-2">
                                                            <div className="flex items-center justify-between">
                                                                  <Label htmlFor="is_urgent" className="flex items-center gap-2 cursor-pointer">
                                                                        <Badge variant="destructive" className="ml-2">
                                                                              عاجل
                                                                        </Badge>
                                                                        فرصة عاجلة
                                                                  </Label>
                                                                  <Switch
                                                                        id="is_urgent"
                                                                        checked={watch("is_urgent")}
                                                                        onCheckedChange={(checked) => setValue("is_urgent", checked, { shouldValidate: true })}
                                                                  />
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                  <Label htmlFor="is_remote" className="flex items-center gap-2 cursor-pointer">
                                                                        عن بعد
                                                                  </Label>
                                                                  <Switch
                                                                        id="is_remote"
                                                                        checked={watch("is_remote")}
                                                                        onCheckedChange={(checked) => setValue("is_remote", checked, { shouldValidate: true })}
                                                                  />
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                  <Label htmlFor="is_available" className="flex items-center gap-2 cursor-pointer">
                                                                        متاح للتقديم
                                                                  </Label>
                                                                  <Switch
                                                                        id="is_available"
                                                                        checked={watch("is_available")}
                                                                        onCheckedChange={(checked) => setValue("is_available", checked, { shouldValidate: true })}
                                                                  />
                                                            </div>
                                                      </div>
                                                </div>
                                          </CardContent>
                                    </Card>

                                    <Card>
                                          <CardHeader>
                                                <CardTitle>معلومات الموقع</CardTitle>
                                                <CardDescription>حدد موقع الفرصة التطوعية</CardDescription>
                                          </CardHeader>
                                          <CardContent className="space-y-6">
                                                 <div className="flex justify-end -mt-2 mb-2">
                                                       <Button
                                                             type="button"
                                                             variant="ghost"
                                                             size="sm"
                                                             onClick={() => setShowAddContact(!showAddContact)}
                                                             className="gap-1 text-xs text-primary hover:bg-primary/10"
                                                       >
                                                             <UserPlus className="h-3.5 w-3.5" />
                                                             إضافة رقم لهيئة جديدة
                                                       </Button>
                                                 </div>

                                                 {contacts.length > 0 && (
                                                       <div className="p-3 bg-muted/40 rounded-lg border border-border/50 space-y-2">
                                                             <Label className="text-xs font-semibold text-primary">اختر جهة اتصال مسبقة للهيئة:</Label>
                                                             <Select
                                                                   value={selectedContactId}
                                                                   onValueChange={(val) => {
                                                                         setSelectedContactId(val)
                                                                         if (val !== "manual") {
                                                                               const found = contacts.find((c) => String(c.id) === val)
                                                                               if (found) {
                                                                                     setValue("phone_number", found.phone_number, { shouldValidate: true })
                                                                               }
                                                                         }
                                                                   }}
                                                             >
                                                                   <SelectTrigger>
                                                                         <SelectValue placeholder="اختر نقطة الاتصال" />
                                                                   </SelectTrigger>
                                                                   <SelectContent>
                                                                         <SelectItem value="manual">-- إدخال يدوي مخصص لهذه الفرصة --</SelectItem>
                                                                         {contacts.map((c) => (
                                                                               <SelectItem key={c.id} value={String(c.id)}>
                                                                                     {c.contact_name} ({c.phone_number}) {c.role_title ? ` - ${c.role_title}` : ""}
                                                                               </SelectItem>
                                                                         ))}
                                                                   </SelectContent>
                                                             </Select>
                                                       </div>
                                                 )}

                                                 {showAddContact && (
                                                       <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3">
                                                             <h4 className="text-sm font-semibold text-primary">تسجيل نقطة اتصال جديدة لحساب الهيئة:</h4>
                                                             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                                   <Input
                                                                         placeholder="اسم الشخص المسؤول"
                                                                         value={newContactName}
                                                                         onChange={(e) => setNewContactName(e.target.value)}
                                                                   />
                                                                   <Input
                                                                         placeholder="رقم الهاتف (مثال: 0555123456)"
                                                                         value={newContactPhone}
                                                                         maxLength={10}
                                                                         onChange={(e) => setNewContactPhone(e.target.value)}
                                                                   />
                                                                   <Input
                                                                         placeholder="الصفة / المنصب (اختياري)"
                                                                         value={newContactRole}
                                                                         onChange={(e) => setNewContactRole(e.target.value)}
                                                                   />
                                                             </div>
                                                             <div className="flex justify-end gap-2">
                                                                   <Button
                                                                         type="button"
                                                                         variant="ghost"
                                                                         size="sm"
                                                                         onClick={() => setShowAddContact(false)}
                                                                   >
                                                                         إلغاء
                                                                   </Button>
                                                                   <Button
                                                                         type="button"
                                                                         size="sm"
                                                                         onClick={handleSaveNewContact}
                                                                         disabled={isAddingContact}
                                                                   >
                                                                         {isAddingContact ? "جاري الحفظ..." : "حفظ في جهات اتصال الهيئة"}
                                                                   </Button>
                                                             </div>
                                                       </div>
                                                 )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                      <div>
                                                            <Label htmlFor="wilaya">الولاية <span className="text-destructive">*</span></Label>
                                                            <Select
                                                                  value={watch("wilaya")}
                                                                  onValueChange={(value) => {
                                                                        setSelectedWilaya(value)
                                                                        setValue("wilaya", value, { shouldValidate: true, shouldDirty: true })
                                                                  }}
                                                            >
                                                                  <SelectTrigger>
                                                                        <SelectValue placeholder="اختر الولاية" />
                                                                  </SelectTrigger>
                                                                  <SelectContent>
                                                                        {wilayas.map((wilaya) => (
                                                                              <SelectItem key={wilaya.code} value={wilaya.code}>
                                                                                    {wilaya.name.arabic}
                                                                              </SelectItem>
                                                                        ))}
                                                                  </SelectContent>
                                                            </Select>
                                                            {errors.wilaya && <p className="text-destructive text-sm mt-1">{errors.wilaya.message}</p>}
                                                      </div>

                                                      <div>
                                                            <Label htmlFor="daira">الدائرة <span className="text-destructive">*</span></Label>
                                                            <Select
                                                                  value={watch("daira")}
                                                                  onValueChange={(value) => setValue("daira", value, { shouldValidate: true, shouldDirty: true })}
                                                                  disabled={!selectedWilaya}
                                                            >
                                                                  <SelectTrigger>
                                                                        <SelectValue placeholder="اختر الدائرة" />
                                                                  </SelectTrigger>
                                                                  <SelectContent>
                                                                        {selectedWilaya &&
                                                                              dairas.map((daira) => (
                                                                                    <SelectItem key={daira.id} value={daira.name.arabic}>
                                                                                          {daira.name.arabic}
                                                                                    </SelectItem>
                                                                              ))}
                                                                  </SelectContent>
                                                            </Select>
                                                            {errors.daira && <p className="text-destructive text-sm mt-1">{errors.daira.message}</p>}
                                                      </div>
                                                </div>

                                                {/* GPS Coordinates & Interactive Map Picker */}
                                                <div className="pt-5 border-t border-border/40 space-y-4">
                                                      <div>
                                                            <Label className="font-bold text-foreground flex items-center gap-2 text-sm sm:text-base">
                                                                  <MapPin className="h-4 w-4 text-primary" />
                                                                  تحديد مكان الفرصة على الخريطة التفاعلية
                                                            </Label>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                  انقر على أي نقطة على الخريطة أو اسحب المؤشر لتحديد موقع الفعالية الميدانية، وسيتمكن المتطوعون من رؤيتها في الخريطة الوطنية.
                                                            </p>
                                                      </div>

                                                      <LocationPickerWrapper
                                                            latitude={watch("latitude") !== undefined && watch("latitude") !== null && watch("latitude") !== "" ? Number(watch("latitude")) : null}
                                                            longitude={watch("longitude") !== undefined && watch("longitude") !== null && watch("longitude") !== "" ? Number(watch("longitude")) : null}
                                                            selectedWilaya={selectedWilaya || watch("wilaya")}
                                                            onChange={({ latitude, longitude }) => {
                                                                  setValue("latitude", latitude, { shouldValidate: true, shouldDirty: true })
                                                                  setValue("longitude", longitude, { shouldValidate: true, shouldDirty: true })
                                                            }}
                                                      />

                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                                            <div>
                                                                  <Label htmlFor="latitude" className="text-xs text-muted-foreground">خط العرض (Latitude)</Label>
                                                                  <Input
                                                                        id="latitude"
                                                                        type="number"
                                                                        step="any"
                                                                        placeholder="مثال: 36.7538"
                                                                        {...register("latitude")}
                                                                  />
                                                            </div>
                                                            <div>
                                                                  <Label htmlFor="longitude" className="text-xs text-muted-foreground">خط الطول (Longitude)</Label>
                                                                  <Input
                                                                        id="longitude"
                                                                        type="number"
                                                                        step="any"
                                                                        placeholder="مثال: 3.0588"
                                                                        {...register("longitude")}
                                                                  />
                                                            </div>
                                                      </div>
                                                </div>
                                          </CardContent>
                                    </Card>

                                    <Card>
                                          <CardHeader>
                                                <CardTitle>صورة الفرصة</CardTitle>
                                                <CardDescription>أضف صورة تعبر عن الفرصة التطوعية (اختياري)</CardDescription>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                                <div className="flex flex-col items-center gap-4">
                                                      <div className="w-full max-w-md aspect-video relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                                                            {imagePreview ? (
                                                                  <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                                                            ) : (
                                                                  <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                                                                        <Upload className="h-12 w-12 text-gray-400" />
                                                                        <p className="mt-2 text-sm text-gray-500">اضغط أو اسحب صورة هنا</p>
                                                                  </div>
                                                            )}
                                                            <input
                                                                  type="file"
                                                                  accept="image/*"
                                                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                  onChange={handleImageChange}
                                                            />
                                                      </div>
                                                      {errors.image && <p className="text-destructive text-sm mt-1">{errors.image.message}</p>}
                                                </div>
                                          </CardContent>
                                    </Card>

                                    {/* Contact Information */}
                                    <Card>
                                          <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                             <PhoneCall className="h-5 w-5 text-primary" />
                                                             معلومات الاتصال بنقطة الفرصة
                                                       </CardTitle>
                                                <CardDescription>أدخل معلومات الاتصال للمتطوعين</CardDescription>
                                          </CardHeader>
                                          <CardContent className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                      <div>
                                                            <Label htmlFor="phone_number">رقم الهاتف <span className="text-destructive">*</span></Label>
                                                            <Input id="phone_number" maxLength={10} placeholder="0555123456" {...register("phone_number")} />
                                                            {errors.phone_number && <p className="text-destructive text-sm mt-1">{errors.phone_number.message}</p>}
                                                      </div>

                                                      <div>
                                                            <Label htmlFor="email">البريد الإلكتروني <span className="text-destructive">*</span></Label>
                                                            <Input id="email" type="email" placeholder="example@domain.com" {...register("email")} />
                                                            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                                                      </div>
                                                </div>
                                          </CardContent>
                                    </Card>

                                    {/* Responsibilities */}
                                    <Card>
                                          <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                       <Sparkles className="h-5 w-5 text-amber-500" />
                                                       المسؤوليات ودليل المهام <span className="text-destructive">*</span>
                                                 </CardTitle>
                                                <CardDescription>أضف مسؤوليات ومهام المتطوع (واحدة على الأقل)</CardDescription>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                                 {templates.length > 0 && (
                                                       <div className="p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-2">
                                                             <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                                                                   <Sparkles className="h-3.5 w-3.5" />
                                                                   دليل المسؤوليات الجاهزة (اضغط على أي مهمة لإضافتها فوراً):
                                                             </p>
                                                             <div className="flex flex-wrap gap-1.5">
                                                                   {templates.map((tpl) => (
                                                                         <Badge
                                                                               key={tpl.id}
                                                                               variant="outline"
                                                                               onClick={() => handleAddTemplate(tpl.title)}
                                                                               className="cursor-pointer hover:bg-amber-500 hover:text-white transition-colors text-xs py-1 px-2.5 bg-background shadow-xs"
                                                                         >
                                                                               + {tpl.title}
                                                                         </Badge>
                                                                   ))}
                                                             </div>
                                                       </div>
                                                 )}
                                                {errors.responsabilities?.message && (
                                                      <p className="text-destructive text-sm">{errors.responsabilities.message}</p>
                                                )}
                                                {responsabilityFields.map((field, index) => (
                                                      <div key={field.id} className="space-y-1">
                                                            <div className="flex gap-4">
                                                                  <Input placeholder="أدخل المسؤولية (مثال: تنظيم وتوجيه الحضور)" {...register(`responsabilities.${index}.title`)} />
                                                                  {responsabilityFields.length > 1 && (
                                                                        <Button type="button" variant="outline" size="icon" onClick={() => removeResponsability(index)}>
                                                                              <Minus className="h-4 w-4" />
                                                                        </Button>
                                                                  )}
                                                            </div>
                                                            {errors.responsabilities?.[index]?.title && (
                                                                  <p className="text-destructive text-sm">{errors.responsabilities[index]?.title?.message}</p>
                                                            )}
                                                      </div>
                                                ))}
                                                <Button
                                                      type="button"
                                                      variant="outline"
                                                      className="w-full"
                                                      onClick={() => appendResponsability({ title: "" })}
                                                >
                                                      <Plus className="h-4 w-4 ml-2" />
                                                      إضافة مسؤولية
                                                </Button>
                                          </CardContent>
                                    </Card>

                                    {/* Qualifications */}
                                    <Card>
                                          <CardHeader>
                                                <CardTitle>المؤهلات المطلوبة <span className="text-destructive">*</span></CardTitle>
                                                <CardDescription>أضف المؤهلات والمهارات المطلوبة للمتطوع (واحدة على الأقل)</CardDescription>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                                {errors.qualifications?.message && (
                                                      <p className="text-destructive text-sm">{errors.qualifications.message}</p>
                                                )}
                                                {qualificationFields.map((field, index) => (
                                                      <div key={field.id} className="space-y-1">
                                                            <div className="flex gap-4">
                                                                  <Input placeholder="أدخل المؤهل (مثال: مهارات العمل الجماعي والتواصل)" {...register(`qualifications.${index}.title`)} />
                                                                  {qualificationFields.length > 1 && (
                                                                        <Button type="button" variant="outline" size="icon" onClick={() => removeQualification(index)}>
                                                                              <Minus className="h-4 w-4" />
                                                                        </Button>
                                                                  )}
                                                            </div>
                                                            {errors.qualifications?.[index]?.title && (
                                                                  <p className="text-destructive text-sm">{errors.qualifications[index]?.title?.message}</p>
                                                            )}
                                                      </div>
                                                ))}
                                                <Button
                                                      type="button"
                                                      variant="outline"
                                                      className="w-full"
                                                      onClick={() => appendQualification({ title: "" })}
                                                >
                                                      <Plus className="h-4 w-4 ml-2" />
                                                      إضافة مؤهل
                                                </Button>
                                          </CardContent>
                                    </Card>

                                    <div className="flex justify-end gap-4">
                                          <Button type="button" variant="outline" onClick={() => router.back()}>
                                                إلغاء
                                          </Button>
                                          <Button type="submit" className="text-white" disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                      "جاري النشر..."
                                                ) : (
                                                      <>
                                                            نشر الفرصة
                                                            <ArrowLeft className="h-4 w-4 ml-2" />
                                                      </>
                                                )}
                                          </Button>
                                    </div>
                              </form>
                        </div>
                  </BackgroundDecorations>
            </div>
      )
}

export default AddOpportunityForm
