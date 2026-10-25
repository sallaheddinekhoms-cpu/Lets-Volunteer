"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Building2, Mail, Lock, Phone, Loader2, User, FileCheck, EyeOff, Eye } from "lucide-react"
import { useState, useTransition } from "react"
import Turnstile from "react-turnstile"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { OrganisationRegisterSchema } from "@/schema/AuthSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { organization_register } from "@/actions/organization-register"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function OrganisationRegisterForm() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isPending, startTransition] = useTransition()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const form = useForm<z.infer<typeof OrganisationRegisterSchema>>({
    resolver: zodResolver(OrganisationRegisterSchema),
    defaultValues: {
      organization_name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone_number: "",
      organization_type: "جمعية خيرية",
      approval_id: "",
      president_name: "",
      captcha_token: ""
    },
  })

  const organizationType = form.watch("organization_type")

  const onSubmit = async (values: z.infer<typeof OrganisationRegisterSchema>) => {
    console.log("values", values)
    setError("")
    setSuccess("")

    startTransition(() => {
      organization_register(values)
        .then((response: any) => {
          setSuccess(response.success)
          setError(response.error)
          
          // Reset captcha on error
          if (response.error) {
            form.setValue("captcha_token", "");
            setResetKey(prev => prev + 1);
          } else {
            form.reset()
          }
          // router.push("/");
        })
        .catch((err) => {
          console.log("err", err)
          setError(err.error)
          // Reset captcha on error
          form.setValue("captcha_token", "");
          setResetKey(prev => prev + 1);
        })
    })
  }

  return (
    <Form {...form}>
      <motion.form
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4 sm:space-y-6"
        dir="rtl"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="organization_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-right block text-sm sm:text-base">اسم الهيئة</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        id="first_name"
                        type="text"
                        placeholder="جمعية ..."
                        className="bg-white/10 border-primary/20 text-primary placeholder:text-primary/50 pl-10 text-right text-sm sm:text-base"
                      />

                      <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-primary/50" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Add the radio button group for organization type */}
            <FormField
              control={form.control}
              name="organization_type"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-primary text-right block text-sm sm:text-base">نوع الهيئة</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex justify-start flex-row-reverse space-y-1 scale-100"
                    >
                      <div className="flex items-center gap-2 space-x-2 space-x-reverse">
                        <RadioGroupItem value="جمعية خيرية" id="charity" />
                        <FormLabel htmlFor="charity" className="text-primary cursor-pointer">
                          جمعية خيرية
                        </FormLabel>
                      </div>
                      <div className="flex items-center gap-2 space-x-2 space-x-reverse">
                        <RadioGroupItem value="أخرى" id="other" />
                        <FormLabel htmlFor="other" className="text-primary cursor-pointer">
                          أخرى
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditional field for approval ID */}
            {organizationType === "جمعية خيرية" && (
              <FormField
                control={form.control}
                name="approval_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary text-right block text-sm sm:text-base">رقم الاعتماد</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="text"
                          placeholder="رقم الاعتماد"
                          className="bg-white/10 border-primary/20 text-primary placeholder:text-primary/50 pl-10 text-right text-sm sm:text-base"
                        />
                        <FileCheck className="absolute left-3 top-2.5 h-5 w-5 text-primary/50" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Conditional field for president name */}
            {organizationType === "أخرى" && (
              <FormField
                control={form.control}
                name="president_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary text-right block text-sm sm:text-base">
                      اسم رئيس الهيئة
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="text"
                          placeholder="اسم رئيس الهيئة"
                          className="bg-white/10 border-primary/20 text-primary placeholder:text-primary/50 pl-10 text-right text-sm sm:text-base"
                        />
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-primary/50" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="gap-3 grid grid-cols-2 sm:gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary text-right block text-sm sm:text-base">
                      البريد الالكتروني
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          placeholder="example@gmail.com"
                          className="bg-white/10 border-primary/20 text-primary placeholder:text-primary/50 pl-10 text-right text-sm sm:text-base"
                        />

                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-primary/50" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary text-right block text-sm sm:text-base">رقم الهاتف</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          id="phone_number"
                          type="text"
                          maxLength={10}
                          placeholder="055..."
                          className="bg-white/10 border-primary/20 text-primary placeholder:text-primary/50 pl-10 text-right text-sm sm:text-base"
                        />

                        <Phone className="absolute left-3 top-2.5 h-5 w-5 text-primary/50" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="gap-3 grid grid-cols-2 sm:gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-primary text-right block text-sm sm:text-base">كلمة المرور</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="كلمة المرور"
                          className="bg-white/10 border-primary/20 text-primary placeholder:text-primary/50 pl-10 text-right text-sm sm:text-base"
                        />

                        <Lock className="absolute left-12  top-2.5 h-5 w-5 text-primary/50" />

                        <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-2.5 text-primary/50 hover:text-primary focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                        
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
                  <FormItem>
                    <FormLabel className="text-primary text-right block text-sm sm:text-base">
                      تأكيد كلمة المرور
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          id="confirm_password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="تأكيد كلمة المرور"
                          className="bg-white/10 border-primary/20 text-primary
                           placeholder:text-primary/50 pl-10 text-right text-sm sm:text-base"
                        />

                        <Lock className="absolute left-12  top-2.5 h-5 w-5 text-primary/50" />

                        <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-3 top-2.5 text-primary/50 hover:text-primary focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Cloudflare Turnstile Captcha */}
        <FormField
          control={form.control}
          name="captcha_token"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex justify-center">
                  <Turnstile
                    key={resetKey}
                    sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
                    onVerify={(token) => {
                      field.onChange(token);
                    }}
                    onError={() => {
                      field.onChange("");
                    }}
                    onExpire={() => {
                      field.onChange("");
                    }}
                    theme="light"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-red-500 text-xs sm:text-sm mt-3">{error}</p>}
        {success && <p className="text-green-500 text-xs sm:text-sm mt-3">{success}</p>}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-primary hover:bg-primary/90 text-white text-base sm:text-lg h-10 sm:h-12"
        >
          {isPending ? <Loader2 className="animate-spin" /> : "تسجيل"}
        </Button>
      </motion.form>
    </Form>
  )
}

