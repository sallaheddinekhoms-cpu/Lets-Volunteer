"use server"

import { Backend } from "@/lib/helper";
import { VolunteerRegisterSchmea } from "@/schema/AuthSchema";
import { z } from "zod";


export async function volunteer_register( values: z.infer<typeof VolunteerRegisterSchmea> ) {

      console.log("values",values)

      const validatedFields = VolunteerRegisterSchmea.safeParse(values)

      if (!validatedFields.success) {
            return { error: "Invalid fields!" };
          }
      
      try {
            const volunteer_register_data = validatedFields.data

            const { data , status } = await Backend.post("auth/volunteer/register/", {
                  body : volunteer_register_data
            })
            console.log("data",data)
            if (status === 201) {
                  return { success: "تم التسجيل بنجاح ستسلم رابط تأكد البريد الالكتروني للتفعيل" };
            }

            else if (status === 400) {
                  return { error: "البريد الالكتروني موجود بالفعل" };
            }

            else {
                  return { error: "حدث خطأ ما" };
            }
            

      }
      catch (error) {
            console.error("Register error:", error);
            return { error: "حدث خطأ ما" };
      }


      

}
      
 


