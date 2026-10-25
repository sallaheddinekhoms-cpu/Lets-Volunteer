"use client"

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASE_URL } from "@/lib/constant";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const PasswordResetRequestSchema = z.object({
  email: z.string().email({ message: "بريد إلكتروني غير صالح" }),
});

export function RequestResetPassword() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof PasswordResetRequestSchema>>({
    resolver: zodResolver(PasswordResetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof PasswordResetRequestSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      fetch(`${BASE_URL}/auth/password-reset/request/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            setSuccess(data.message);
            form.reset();
          } else if (data.email) {
            setError(data.email);
          } else {
            setError("حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور");
          }
        })
        .catch((err) => {
          console.error(err);
          setError("حدث خطأ أثناء الاتصال بالخادم");
        });
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
          <h2 className="text-2xl font-bold text-primary text-right">
            إعادة تعيين كلمة المرور
          </h2>
          <p className="text-sm text-gray-600 text-right">
            أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور الخاصة بك.
          </p>
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
                      type="email"
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
        </div>

        {error && <p className="text-red-500 text-sm sm:text-base text-right">{error}</p>}
        {success && <p className="text-green-500 text-sm sm:text-base text-right">{success}</p>}

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white text-base sm:text-lg h-10 sm:h-12">
          {isPending ? <Loader2 className="animate-spin" /> : "إرسال رابط إعادة تعيين كلمة المرور"}
        </Button>
      </motion.form>
    </Form>
  );
}
