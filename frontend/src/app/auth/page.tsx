"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LoginForm } from "@/components/auth/LoginForm";
import BackgroundDecorations from "@/components/background-decorations";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<"volunteer" | "organization">("volunteer");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <BackgroundDecorations>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md sm:max-w-lg bg-white/10 backdrop-blur-lg rounded-2xl p-4 z-50 sm:p-6 md:p-8 shadow-xl relative"
        >
          <div className="flex justify-center mb-6 sm:mb-8">
            <Image
              src="/black_logo.svg"
              alt="لنتطوع"
              width={100}
              height={50}
              className="sm:w-[120px] sm:h-[60px]"
            />
          </div>

          <Tabs
            defaultValue={userType}
            className="w-full mb-6 sm:mb-8"
            onValueChange={(value) => setUserType(value as "volunteer" | "organization")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
              <TabsTrigger
                value="volunteer"
                className="text-base sm:text-lg data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                متطوع
              </TabsTrigger>
              <TabsTrigger
                value="organization"
                className="text-base sm:text-lg data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                هيئة
              </TabsTrigger>
            </TabsList>

            <TabsContent value="volunteer" className="space-y-4 sm:space-y-6">
              <SocialAuthButtons userType="volunteer" isLogin={isLogin} />
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <LoginForm key="login" userType="volunteer" />
                ) : (
                  <RegisterForm key="register" userType="volunteer" />
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="organization" className="space-y-4 sm:space-y-6">
              <SocialAuthButtons userType="organization" isLogin={isLogin} />
              <AnimatePresence mode="wait">
                {isLogin ? (
                  <LoginForm key="login" userType="organization" />
                ) : (
                  <RegisterForm key="register" userType="organization" />
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-4 sm:mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary/90 hover:text-primary text-sm transition-colors"
            >
              {isLogin ? "ليس لديك حساب؟ سجل الآن" : "لديك حساب؟ سجل الدخول"}
            </button>
          </div>

          <Link
            href="/"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-primary/90 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        </motion.div>
      </BackgroundDecorations>
    </div>
  );
}
