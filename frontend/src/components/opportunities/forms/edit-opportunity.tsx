"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"
import { Plus, Minus, ArrowLeft, Upload, Loader2, MapPin } from "lucide-react"
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
import type { Opportunity } from "@/types/opportunity"
import { updateOpportunity, getOpportunityById } from "@/data/Opportunities"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { RTLDateInput } from "@/components/ui/custom/rtl-date-input"
import { format, parseISO } from "date-fns"
import algerianWilayas from 'algeria-wilayas';
import LocationPickerWrapper from "./location-picker-wrapper"

// Create a modified schema for editing that makes image optional
const editOpportunitySchema = opportunitySchema.extend({
  image: z.instanceof(File)
    .refine(
      (file) => !file || file.size <= 5000000, // 5MB in bytes
      "حجم الصورة يجب أن لا يتجاوز 5 ميغابايت"
    )
    .refine(
      (file) => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      "يجب أن تكون الصورة من نوع JPG أو PNG أو WebP"
    )
    .optional()
});

export type EditOpportunityFormData = z.infer<typeof editOpportunitySchema>

interface EditOpportunityFormProps {
  categories: Category[]
  opportunityId: string
}

const EditOpportunityForm: React.FC<EditOpportunityFormProps> = ({ categories, opportunityId }) => {
  const [selectedWilaya, setSelectedWilaya] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null)
  const [hasPermission, setHasPermission] = useState(false)

  // Debug: Log categories to check if they're loaded
  console.log("Categories in EditOpportunityForm:", categories)

  const wilayas = algerianWilayas.getAllWilayas();
  const dairas = algerianWilayas.getDairasByWilaya(selectedWilaya);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm<EditOpportunityFormData>({
    resolver: zodResolver(editOpportunitySchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      duration: 1,
      date_of_opportunity: undefined,
      is_urgent: false,
      is_remote: false,
      is_available: true,
      wilaya: "",
      daira: "",
      latitude: null,
      longitude: null,
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

  const router = useRouter()

  // Load opportunity data
  useEffect(() => {
    const loadOpportunity = async () => {
      try {
        setLoading(true)
        const { data, status } = await getOpportunityById(opportunityId)
        
        if (status === 200 && data) {
          setOpportunity(data)
          
          // Set permission to true - backend will handle authorization
          setHasPermission(true)
          
          // Set form values
          console.log("Opportunity category:", data.category)
          console.log("Available categories:", categories)
          
          reset({
            title: data.title,
            description: data.description,
            category: String(data.category.id),
            duration: data.duration || 1,
            date_of_opportunity: data.date_of_opportunity ? parseISO(data.date_of_opportunity) : undefined,
            is_urgent: data.is_urgent || false,
            is_remote: data.is_remote || false,
            is_available: data.is_available !== false,
            wilaya: data.wilaya,
            daira: data.daira,
            latitude: data.latitude || null,
            longitude: data.longitude || null,
            phone_number: data.phone_number || "",
            email: data.email || "",
            responsabilities: data.responsabilities.length > 0 
              ? data.responsabilities.map(r => ({ title: r.title }))
              : [{ title: "" }],
            qualifications: data.qualifications.length > 0 
              ? data.qualifications.map(q => ({ title: q.title }))
              : [{ title: "" }],
          })
          
          setSelectedWilaya(data.wilaya)
          // Set existing image if available
          if (data.image) {
            setImagePreview(data.image)
          }
        }
      } catch (error: any) {
        console.error("Error loading opportunity:", error)
        if (error?.response?.status === 403) {
          toast.error("ليس لديك صلاحية لتعديل هذه الفرصة")
          router.push(`/opportunities/${opportunityId}`)
        } else if (error?.response?.status === 404) {
          toast.error("لم يتم العثور على الفرصة المطلوبة")
          router.push("/opportunities")
        } else {
          toast.error("حدث خطأ في تحميل بيانات الفرصة")
        }
      } finally {
        setLoading(false)
      }
    }

    loadOpportunity()
  }, [opportunityId, reset])


  const scrollToError = () => {
    const firstErrorElement = document.querySelector('[data-error="true"]') || 
                             document.querySelector('.text-destructive') ||
                             document.querySelector('[aria-invalid="true"]')
    
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })

      if (firstErrorElement instanceof HTMLInputElement || 
          firstErrorElement instanceof HTMLTextAreaElement ||
          firstErrorElement instanceof HTMLSelectElement) {
        firstErrorElement.focus()
      }
    }
  }

  const onSubmit = async (data: EditOpportunityFormData) => {
    try {
      const formData = new FormData()


      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("is_urgent", data.is_urgent.toString())
      formData.append("is_remote", data.is_remote.toString())
      formData.append("is_available", data.is_available.toString())
      formData.append(
        "date_of_opportunity",
        data.date_of_opportunity ? format(data.date_of_opportunity, "yyyy-MM-dd") : "",
      )
      formData.append("category", data.category)
      formData.append("duration", data.duration.toString())
      formData.append("wilaya", data.wilaya)
      formData.append("daira", data.daira)
      if (data.latitude) {
        formData.append("latitude", data.latitude.toString())
      }
      if (data.longitude) {
        formData.append("longitude", data.longitude.toString())
      }
      formData.append("phone_number", data.phone_number)
      formData.append("email", data.email)

      // Handle image if present
      if (data.image) {
        formData.append("image", data.image)
      }

      // Handle nested arrays properly - filter out empty titles
      data.responsabilities.forEach((resp, index) => {
        const title = Array.isArray(resp.title) ? resp.title[0] : resp.title
        if (title && title.trim()) {
          formData.append(`responsabilities[${index}][title]`, title.trim())
        }
      })

      data.qualifications.forEach((qual, index) => {
        const title = Array.isArray(qual.title) ? qual.title[0] : qual.title
        if (title && title.trim()) {
          formData.append(`qualifications[${index}][title]`, title.trim())
        }
      })

      

      await updateOpportunity(opportunityId, formData)
      
      toast.success("تم تحديث الفرصة التطوعية بنجاح")
      router.push(`/opportunities/${opportunityId}`)

    } catch (error) {
      console.error("Error updating opportunity:", error)
      toast.error("حدث خطأ أثناء تحديث الفرصة التطوعية")
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue("image", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (loading) {
    return (
      <div className="relative min-h-screen bg-background/50 pb-16 flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">جاري تحميل بيانات الفرصة...</p>
        </div>
      </div>
    )
  }

  if (!opportunity || !hasPermission) {
    return (
      <div className="relative min-h-screen bg-background/50 pb-16 flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <p className="text-destructive">
            {!opportunity ? "لم يتم العثور على الفرصة المطلوبة" : "ليس لديك صلاحية لتعديل هذه الفرصة"}
          </p>
          <Button onClick={() => router.push("/opportunities")}>
            العودة إلى الفرص
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background/50 pb-16" dir="rtl">
      <BackgroundDecorations>
        <div className="container lg:w-1/2 mx-auto px-4 py-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="text-center space-y-4">
              <div className="inline-block bg-primary/5 rounded-lg px-6 py-2 mb-4">
                <span className="text-primary font-medium">تعديل الفرصة التطوعية</span>
              </div>
              <h1 className="text-4xl font-bold text-primary">تعديل فرصة التطوع</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                قم بتحديث تفاصيل الفرصة التطوعية حسب الحاجة
              </p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit, () => {
            // Scroll to first error when validation fails
            setTimeout(scrollToError, 100)
          })} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>المعلومات الأساسية</CardTitle>
                <CardDescription>تحديث المعلومات الأساسية للفرصة التطوعية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">عنوان الفرصة</Label>
                      <Input 
                        id="title" 
                        placeholder="أدخل عنوان الفرصة التطوعية" 
                        data-error={!!errors.title}
                        {...register("title")} 
                      />
                      {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
                    </div>                  <RTLDateInput
                    id="date_of_opportunity"
                    label="تاريخ الفرصة"
                    value={watch("date_of_opportunity")}
                    onChange={(date) => setValue("date_of_opportunity", date as Date)}
                    error={errors.date_of_opportunity?.message}
                  />

                    <div>
                      <Label htmlFor="description">وصف الفرصة</Label>
                      <Textarea
                        id="description"
                        placeholder="اشرح تفاصيل الفرصة التطوعية"
                        className="h-32"
                        data-error={!!errors.description}
                        {...register("description")}
                      />
                      {errors.description && (
                        <p className="text-destructive text-sm mt-1">{errors.description.message}</p>
                      )}
                    </div>                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="category">التصنيف</Label>
                      <Select
                        value={watch("category")}
                        onValueChange={(value) => {
                          setValue("category", value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                      >
                        <SelectTrigger data-error={!!errors.category}>
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
                      <Label htmlFor="duration">المدة (بالأيام)</Label>
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

                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_urgent" className="flex items-center gap-2">
                        <Badge variant="destructive" className="ml-2">
                          عاجل
                        </Badge>
                        فرصة عاجلة
                      </Label>
                      <Switch id="is_urgent" {...register("is_urgent")} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_remote" className="flex items-center gap-2">
                        عن بعد
                      </Label>
                      <Switch id="is_remote" {...register("is_remote")} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_available" className="flex items-center gap-2">
                        متاح للتقديم
                      </Label>
                      <Switch id="is_available" {...register("is_available")} checked={watch("is_available")} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معلومات الموقع</CardTitle>
                <CardDescription>تحديث موقع الفرصة التطوعية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="wilaya">الولاية</Label>
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
                    <Label htmlFor="daira">الدائرة</Label>
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
                      انقر على أي نقطة على الخريطة أو اسحب المؤشر لتحديد موقع الفعالية الميدانية بدقة
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
                <CardDescription>تحديث صورة الفرصة التطوعية (اختياري)</CardDescription>
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
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات الاتصال</CardTitle>
                <CardDescription>تحديث معلومات الاتصال للمتطوعين</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone_number">رقم الهاتف</Label>
                    <Input id="phone_number" maxLength={10} placeholder="0555123456" {...register("phone_number")} />
                  </div>

                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input id="email" type="email" placeholder="example@domain.com" {...register("email")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle>المسؤوليات</CardTitle>
                <CardDescription>تحديث مسؤوليات المتطوع</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {responsabilityFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4">
                    <Input placeholder="أدخل المسؤولية" {...register(`responsabilities.${index}.title`)} />
                    {index > 0 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeResponsability(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
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
                <CardTitle>المؤهلات المطلوبة</CardTitle>
                <CardDescription>تحديث المؤهلات المطلوبة للمتطوع</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {qualificationFields.map((field, index) => (
                  <div key={field.id} className="flex gap-4">
                    <Input placeholder="أدخل المؤهل" {...register(`qualifications.${index}.title`)} />
                    {index > 0 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => removeQualification(index)}>
                        <Minus className="h-4 w-4" />
                      </Button>
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
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push(`/opportunities/${opportunityId}`)}
              >
                إلغاء
              </Button>
              <Button type="submit" className="text-white" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    حفظ التغييرات
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

export default EditOpportunityForm