import * as z from "zod";

export const opportunitySchema = z.object({
  title: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
  description: z.string().min(20, "الوصف يجب أن يكون 20 حرفاً على الأقل"),
  is_urgent: z.boolean().default(false),
  is_remote: z.boolean().default(false),
  date_of_opportunity: z.date({
    required_error: "يرجى تحديد تاريخ الفرصة",
    invalid_type_error: "يرجى اختيار تاريخ صالح",
  }).refine((date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, "تاريخ الفرصة يجب أن يكون اليوم أو في تاريخ لاحق"),
  is_available: z.boolean().default(true),
  category: z.string().min(1, "يرجى اختيار التصنيف"),
  duration: z.coerce.number({ invalid_type_error: "يرجى إدخال المدة بالأيام" })
    .min(1, "المدة يجب أن تكون يوم واحد على الأقل")
    .max(30, "المدة يجب أن لا تتجاوز 30 يوماً"),
  wilaya: z.string().min(1, "يرجى اختيار الولاية"),
  daira: z.string().min(1, "يرجى اختيار الدائرة"),
  latitude: z.union([z.number(), z.string()]).optional().nullable(),
  longitude: z.union([z.number(), z.string()]).optional().nullable(),
  phone_number: z.string().min(9, "رقم هاتف غير صالح").max(10, "رقم هاتف غير صالح"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  responsabilities: z.array(
    z.object({
      title: z.string().min(2, "يرجى كتابة نص المسؤولية"),
    })
  ).min(1, "يجب إضافة مسؤولية واحدة على الأقل"),
  qualifications: z.array(
    z.object({
      title: z.string().min(2, "يرجى كتابة نص المؤهل"),
    })
  ).min(1, "يجب إضافة مؤهل واحد على الأقل"),
  image: z.instanceof(File)
    .refine(
      (file) => file && file.size <= 5000000,
      "حجم الصورة يجب أن لا يتجاوز 5 ميغابايت"
    )
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      "يجب أن تكون الصورة من نوع JPG أو PNG أو WebP"
    )
    .optional()
});
