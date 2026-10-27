"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { socialLogin } from "@/actions/social-login";
import { Loader2 } from "lucide-react";

interface SocialAuthButtonsProps {
  userType?: "volunteer" | "organization";
  isLogin?: boolean;
}

export function SocialAuthButtons({ userType = "volunteer", isLogin = true }: SocialAuthButtonsProps) {
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<"google" | "facebook" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setLoadingProvider("google");

    try {
      if (googleClientId && googleClientId.trim() !== "") {
        // Real Google OAuth Flow
        const redirectUri = `${window.location.origin}/auth/callback/google`;
        const scope = encodeURIComponent("openid email profile");
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

        window.location.href = authUrl;
        return;
      }

      // Quick One-Click Dev / Demo Login when API key is not yet configured
      const res = await socialLogin({
        provider: "google",
        is_mock: true,
        email: "google.volunteer@gmail.com",
        first_name: "متطوع",
        last_name: "Google",
        user_type: userType,
      });

      if (res.success) {
        router.push("/profile");
        router.refresh();
      } else {
        setErrorMessage(res.error || "فشل تسجيل الدخول عبر Google");
        setLoadingProvider(null);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "حدث خطأ غير متوقع");
      setLoadingProvider(null);
    }
  };

  const handleFacebookAuth = async () => {
    setErrorMessage(null);
    setLoadingProvider("facebook");

    try {
      if (facebookAppId && facebookAppId.trim() !== "") {
        // Real Facebook OAuth Flow
        const redirectUri = `${window.location.origin}/auth/callback/facebook`;
        const scope = encodeURIComponent("email,public_profile");
        const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&scope=${scope}`;

        window.location.href = authUrl;
        return;
      }

      // Quick One-Click Dev / Demo Login when API key is not yet configured
      const res = await socialLogin({
        provider: "facebook",
        is_mock: true,
        email: "facebook.volunteer@gmail.com",
        first_name: "متطوع",
        last_name: "Facebook",
        user_type: userType,
      });

      if (res.success) {
        router.push("/profile");
        router.refresh();
      } else {
        setErrorMessage(res.error || "فشل تسجيل الدخول عبر Facebook");
        setLoadingProvider(null);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "حدث خطأ غير متوقع");
      setLoadingProvider(null);
    }
  };

  return (
    <div className="w-full space-y-3 mb-6" dir="rtl">
      {errorMessage && (
        <div className="p-3 text-xs sm:text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-center">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loadingProvider !== null}
          className="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 bg-white hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 text-sm sm:text-base font-medium rounded-xl border border-gray-200 dark:border-zinc-700 shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {loadingProvider === "google" ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>{isLogin ? "الدخول بـ Google" : "التسجيل بـ Google"}</span>
        </button>

        {/* Facebook Button */}
        <button
          type="button"
          onClick={handleFacebookAuth}
          disabled={loadingProvider !== null}
          className="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white text-sm sm:text-base font-medium rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {loadingProvider === "facebook" ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          <span>{isLogin ? "الدخول بـ Facebook" : "التسجيل بـ Facebook"}</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-gray-300 dark:border-zinc-700 w-full" />
        <span className="bg-transparent px-3 text-xs sm:text-sm text-gray-500 dark:text-zinc-400 font-medium whitespace-nowrap">
          أو عبر البريد الإلكتروني
        </span>
        <div className="border-t border-gray-300 dark:border-zinc-700 w-full" />
      </div>
    </div>
  );
}
