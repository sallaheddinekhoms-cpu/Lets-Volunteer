import * as z from "zod"

export const VolunteerRegisterSchmea = z.object({

      first_name: z.string().min(3, { message: "الاسم يجب ان يكون 3 احرف على الاقل" }),
      last_name: z.string().min(3, { message: "اللقب يجب ان يكون 3 احرف على الاقل" }),
      email: z.string().email({ message: "عنوان البريد الإلكتروني غير صالح" }),
      phone_number: z.string().min(10, { message: "رقم الهاتف يجب ان يكون 10 ارقام" }).max(10, { message: "رقم الهاتف يجب ان يكون 10 ارقام" }),
      password: z.string().min(6, { message: "كلمة مرور على الاقل 6 حروف" }),
      confirm_password: z.string().min(6, { message: "كلمة مرور على الاقل 6 حروف" }),
      blood_group: z.string().min(2, { message: "فصيلة الدم يجب ان تكون 2 احرف على الاقل" }),
      captcha_token: z.string().min(1, { message: "يرجى إكمال التحقق من عدم الروبوت" }),
      // wilaya: z.string().min(3, { message: "الولاية يجب ان تكون 3 احرف على الاقل" }),
      // daira: z.string().min(3, { message: "الدائرة يجب ان تكون 3 احرف على الاقل" })
      
}).refine(data => data.password === data.confirm_password, {
      message: "كلمة المرور غير متطابقة",
      path: ["confirm_password"] 
})

export const OrganisationRegisterSchema = z.object({
      organization_name : z.string().min(3, { message: "اسم الجمعية يجب ان يكون 3 احرف على الاقل" }),
      email: z.string().email({ message: "عنوان البريد الإلكتروني غير صالح" }),
      password: z.string().min(6, { message: "كلمة مرور على الاقل 6 حروف" }),
      confirm_password: z.string().min(6, { message: "كلمة مرور على الاقل 6 حروف" }),
      phone_number : z.string().min(10, { message: "رقم الهاتف يجب ان يكون 10 ارقام" }),
      organization_type : z.enum(["جمعية خيرية","أخرى"],{
            required_error : "يجب اختيار نوع الجمعية"
      }),
      approval_id : z.string().optional() ,
      president_name : z.string().optional(),
      captcha_token: z.string().min(1, { message: "يرجى إكمال التحقق من عدم الروبوت" })
}).refine(data => data.password === data.confirm_password, {
      message: "كلمة المرور غير متطابقة",
      path: ["confirm_password"] 
}).refine(
      (data) => {
            if(data.organization_type === "جمعية خيرية" ){
                  return !!data.approval_id
            }
            return true
      },
      {
            message: "رقم الاعتماد مطلوب للجمعيات الخيرية",
            path: ["approval_id"],
      }
).refine(
      (data) => {
        if (data.organization_type === "أخرى") {
          return !!data.president_name
        }
        return true
      },
      {
        message: "اسم رئيس الهيئة مطلوب",
        path: ["president_name"],
      },
    )



export const LoginSchema = z.object({
      email: z.string().email({ message: "عنوان البريد الإلكتروني غير صالح" }),
      password: z.string().min(6, { message: "كلمة مرور على الاقل 6 حروف" }),
      user_type : z.string().default("volunteer"),
      captcha_token: z.string().min(1, { message: "يرجى إكمال التحقق من عدم الروبوت" })
})