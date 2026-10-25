"use server"

import { Backend } from "@/lib/helper";
import { LoginSchema } from "@/schema/AuthSchema";
import { z } from "zod";
import { cookies } from "next/headers";


export async function login( values : z.infer< typeof LoginSchema> ) {

      const validatedFields = LoginSchema.safeParse(values)


      if (!validatedFields.success) {
            return { error: "Invalid fields!" };
          }

      try {
            const login_data = validatedFields.data

            const { data , status } = await Backend.post("auth/login/", {
                  body : login_data
            })
            console.log("data", data)
            if (status === 200) {

                  const cookieStore = await cookies()
                  cookieStore.set("access", data.access)
                  cookieStore.set("refresh", data.refresh)

                  return { success: "تم تسجيل الدخول بنجاح" };
            }

            else if (status === 203) {
                  console.log("data", data)
                  return { token : data.token }
            }

            else if (status === 401 || status === 404 ) {
                  return { error: "البريد الالكتروني او كلمة المرور غير صحيحة" };
            }

            else if (status === 403 ) {
                  return { error: "الحساب غير مفعل بعد قم بتفعيله عن طريق الرابط المرسل عبر البريد" };
            }

            else {
                  return { error: "حدث خطأ ما" };
            }
      }
      catch (error) {
            console.error("Login error:", error);
            return { error: "حدث خطأ ما" };
        }
        
             
        


}