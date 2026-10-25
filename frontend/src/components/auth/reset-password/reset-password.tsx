"use client"

import { useState, useTransition } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Loader2, Eye, EyeOff } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { BASE_URL } from "@/lib/constant"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Schema for password reset
const PasswordResetSchema = z
  .object({
    password: z.string().min(8, { message: "كلمة المرور يجب أن تحتوي على الأقل 8 أحرف" }),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirm_password"],
  })

export function ResetPassword({ token }: { token: string }) {
  console.log("token", token)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof PasswordResetSchema>>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof PasswordResetSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      fetch(`${BASE_URL}/auth/password-reset/confirm/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: values.password,
          confirm_password: values.confirm_password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("data", data)
          if (data.message) {
            setSuccess(data.message)
            // Redirect to login page after successful password reset
            setTimeout(() => {
              router.push("/auth")
            }, 3000)
          } else if (data.token) {
            setError(data.token)
          } else if (data.password) {
            setError(data.password)
          } else if (data.confirm_password) {
            setError(data.confirm_password)
          } else {
            setError("حدث خطأ أثناء إعادة تعيين كلمة المرور")
          }
        })
        .catch((err) => {
          console.error(err)
          setError("حدث خطأ أثناء الاتصال بالخادم")
        })
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <Form {...form}>
      <motion.form
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-5 sm:space-y-7 w-full max-w-md p-6 sm:p-8 bg-white rounded-xl shadow-md"
        dir="rtl"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-4 sm:space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary text-right">إعادة تعيين كلمة المرور</h2>
          <p className="text-sm sm:text-base text-gray-600 text-right">قم بإدخال كلمة المرور الجديدة الخاصة بك</p>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel
                  className="text-primary text-right block text-sm sm:text-base font-medium"
                  htmlFor="password"
                >
                  كلمة المرور الجديدة
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-white/10 border-primary/20 text-primary placeholder:text-primary/50 pl-20 pr-10 text-right text-sm sm:text-base h-12"
                    />
                    <Lock className="absolute right-3 top-3.5 h-5 w-5 text-primary/50" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-2 h-8 w-8 text-primary/70 hover:text-primary"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      <span className="sr-only">{showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}</span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel
                  className="text-primary text-right block text-sm sm:text-base font-medium"
                  htmlFor="confirm_password"
                >
                  تأكيد كلمة المرور
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      id="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-white/10 border-primary/20 text-primary placeholder:text-primary/50 pl-20 pr-10 text-right text-sm sm:text-base h-12"
                    />
                    <Lock className="absolute right-3 top-3.5 h-5 w-5 text-primary/50" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-2 h-8 w-8 text-primary/70 hover:text-primary"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      <span className="sr-only">
                        {showConfirmPassword ? "إخفاء تأكيد كلمة المرور" : "إظهار تأكيد كلمة المرور"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {error && <p className="text-red-500 text-sm sm:text-base text-right">{error}</p>}
        {success && <p className="text-green-500 text-sm sm:text-base text-right">{success}</p>}
        {success && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-sm sm:text-base text-gray-500 text-right"
          >
            سيتم توجيهك إلى صفحة تسجيل الدخول خلال 3 ثوان...
          </motion.p>
        )}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white text-base sm:text-lg h-12 sm:h-14 mt-6"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="animate-spin mr-2" /> : "إعادة تعيين كلمة المرور"}
        </Button>
      </motion.form>
    </Form>
  )
}
