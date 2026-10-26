"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/actions/login";
import Turnstile from "react-turnstile";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [captchaToken, setCaptchaToken] = useState("");
 
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!captchaToken) {
      setError("يرجى إكمال التحقق من عدم الروبوت");
      return;
    }
    
    startTransition(() => {


      login({ email, password, user_type: "admin", captcha_token: captchaToken })
            .then((response: any) => {
                  
                  if(response.success) {
                              router.push("/dashboard")
                       
                  }
                  setError(response.error);
                  
            })
            .catch((err) => {
                  console.log(err)
                  setError(err.error);
            })
});
    
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div dir="rtl" className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <img
            src="/black_logo.svg"
            alt="Logo"
            className="w-40 h-20"
          />
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold text-primary">تسجيل الدخول للوحة التحكم</h1>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rtl:text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rtl:text-right"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Cloudflare Turnstile Captcha */}
              <div className="flex justify-center">
                <Turnstile
                  sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"}
                  onVerify={(token) => setCaptchaToken(token)}
                  onError={() => setCaptchaToken("")}
                  onExpire={() => setCaptchaToken("")}
                  theme="light"
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-primary text-white" 
                disabled={isPending}
              >
                {isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}