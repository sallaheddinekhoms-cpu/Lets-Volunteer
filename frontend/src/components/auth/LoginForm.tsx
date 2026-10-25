"use client"

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Loader2, EyeOff, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginSchema } from "@/schema/AuthSchema";
import { zodResolver } from "@hookform/resolvers/zod"
import { login } from "@/actions/login";
import { useRouter } from "next/navigation";
import Turnstile from "react-turnstile";
import {
      Form,
      FormControl,
      FormField,
      FormItem,
      FormLabel,
      FormMessage,
} from "@/components/ui/form"



export function LoginForm({ userType }: { userType: "volunteer" | "organization" }) {

      const [error, setError] = useState("")
      const [success, setSuccess] = useState("")
      const [isPending, startTransition] = useTransition()

      const [showPassword, setShowPassword] = useState(false)

      const router = useRouter()
      const [resetKey, setResetKey] = useState(0)


      const form = useForm<z.infer<typeof LoginSchema>>({
            resolver: zodResolver(LoginSchema),
            defaultValues: {
                  email: "",
                  password: "",
                  user_type: userType,
                  captcha_token: ""
            }
      })



      const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
            console.log("values", values)
            setError("")
            setSuccess("")

            startTransition(() => {


                  login(values)
                        .then((response: any) => {
                              setSuccess(response.success);

                              if (response.success) {
                                    router.push("/profile")

                              }

                              if (response.token) {
                                    router.push(`/auth/reset-password?token=${response.token}`)
                              }

                              setError(response.error);
                              
                              // Reset captcha on error
                              if (response.error) {
                                    form.setValue("captcha_token", "");
                                    setResetKey(prev => prev + 1);
                              }

                        })
                        .catch((err) => {
                              setError(err.error);
                              // Reset captcha on error
                              form.setValue("captcha_token", "");
                              setResetKey(prev => prev + 1);
                        })
            });
      };




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
                              <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                          <FormItem>
                                                <FormLabel className="text-primary text-right block text-sm sm:text-base" htmlFor="email">
                                                      البريد الإلكتروني
                                                </FormLabel>
                                                <FormControl>
                                                      <div className="relative">
                                                            <Input
                                                                  {...field}
                                                                  id="email"
                                                                  type="text"
                                                                  placeholder="example@email.com"
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

                        {error && <p className="text-red-500 text-sm sm:text-base">{error}</p>}
                        {success && <p className="text-green-500 text-sm sm:text-base">{success}</p>}


                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white text-base sm:text-lg h-10 sm:h-12">
                              {isPending ? (<Loader2 className="animate-spin" />) : (userType === "volunteer" ? "دخول كمتطوع" : "دخول كجمعية")}
                        </Button>

                        <div className="flex justify-end mt-2">
                              <a
                                    href="/auth/forget-password"
                                    className="text-primary hover:underline text-sm sm:text-base"
                              >
                                    نسيت كلمة المرور؟
                              </a>
                        </div>
                  </motion.form>
            </Form>

      );


}