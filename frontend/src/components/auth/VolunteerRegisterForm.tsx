"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import Turnstile from "react-turnstile";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { VolunteerRegisterSchmea } from "@/schema/AuthSchema";
import { volunteer_register } from "@/actions/volunteer-register";
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function VolunteerRegisterForm() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  const form = useForm<z.infer<typeof VolunteerRegisterSchmea>>({
    resolver: zodResolver(VolunteerRegisterSchmea),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      password: "",
      confirm_password: "",
      blood_group: "A+",
      captcha_token: "1x00000000000000000000AA"
    }
  })

  const onSubmit = async (values: z.infer<typeof VolunteerRegisterSchmea>) => {
    console.log("values", values)
    setError("")
    setSuccess("")

    startTransition(() => {
      volunteer_register(values)
        .then((response: any) => {
          setSuccess(response.success);
          setError(response.error);
          // Reset captcha on error
          if (response.error) {
            form.setValue("captcha_token", "1x00000000000000000000AA");
            setResetKey(prev => prev + 1);
          }
        })
        .catch((err) => {
          console.log("err", err)
          setError(err.error);
          // Reset captcha on error
          form.setValue("captcha_token", "1x00000000000000000000AA");
          setResetKey(prev => prev + 1);
        });
    });
  };

  const blood_types = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-"
  ]

  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4 sm:space-y-6"
        dir="rtl"
      >
        {/* First name and last name fields remain unchanged */}
        <div className="space-y-3 sm:space-y-4">
          <div className='gap-3 grid grid-cols-2 sm:gap-4'>
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-right block text-sm sm:text-base" htmlFor="first_name">
                    الاسم
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        id="first_name"
                        type="text"
                        placeholder="محمد"
                        className="bg-white/10 border-primary/20 text-primary placeholder:text-primary/50 pl-10 text-right text-sm sm:text-base"
                      />
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-primary/50" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-right block text-sm sm:text-base" htmlFor="last_name">
                    اللقب
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        id="last_name"
                        type="text"
                        placeholder="احمد"
                        className="bg-white/10 border-primary/20 text-primary placeholder:text-primary/50 pl-10 text-right text-sm sm:text-base"
                      />
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-primary/50" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email and phone fields remain unchanged */}
          <div className='gap-3 grid grid-cols-2 sm:gap-4'>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-right block text-sm sm:text-base" htmlFor="email">
                    البريد الالكتروني
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="البريد الالكتروني"
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
                  <FormLabel className="text-primary text-right block text-sm sm:text-base" htmlFor="phone_number">
                    رقم الهاتف
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        maxLength={10}
                        id="phone_number"
                        type="text"
                        max={10}
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

          {/* Updated password fields with show/hide functionality */}
          <div className='gap-3 grid grid-cols-2 sm:gap-4'>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary text-right block text-sm sm:text-base" htmlFor="password">
                    كلمة المرور
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder=" كلمة المرور"
                        className="bg-white/10 border-primary/20 text-primary placeholder:text-primary/50 pl-20 text-right text-sm sm:text-base"
                      />
                      <Lock className="absolute left-12 top-2.5 h-5 w-5 text-primary/50" />
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
                  <FormLabel className="text-primary text-right block text-sm sm:text-base" htmlFor="confirm_password">
                    تأكيد كلمة المرور
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="تأكيد كلمة المرور"
                        className="bg-white/10 border-primary/20 text-primary placeholder:text-primary/50 pl-20 text-right text-sm sm:text-base"
                      />
                      <Lock className="absolute left-12 top-2.5 h-5 w-5 text-primary/50" />
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

          {/* Blood group field remains unchanged */}
          <FormField
            control={form.control}
            name="blood_group"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary text-right block text-sm sm:text-base">
                  فصيلة الدم
                </FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value || "A+"}>
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                    onVerify={(token) => {
                      field.onChange(token);
                    }}
                    onError={() => {
                      field.onChange("1x00000000000000000000AA");
                    }}
                    onExpire={() => {
                      field.onChange("1x00000000000000000000AA");
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

        <Button type="submit" disabled={isPending} className="w-full bg-primary hover:bg-primary/90 text-white text-base sm:text-lg h-10 sm:h-12">
          {isPending ? <Loader2 className="animate-spin" /> : "تسجيل"}
        </Button>
      </motion.form>
    </Form>
  );
}