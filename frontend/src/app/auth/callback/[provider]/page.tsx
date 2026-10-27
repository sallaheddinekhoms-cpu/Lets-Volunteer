"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { socialLogin } from "@/actions/social-login";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SocialCallbackPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const provider = (params?.provider as string) === "facebook" ? "facebook" : "google";
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const [statusText, setStatusText] = useState<string>("جاري تأكيد المصادقة...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (errorParam) {
      setError(errorDescription || "تم إلغاء عملية تسجيل الدخول من قبل المستخدم");
      return;
    }

    if (!code) {
      setError("لم يتم استلام رمز التحقق من مزود الخدمة");
      return;
    }

    const processAuth = async () => {
      try {
        setStatusText(
          provider === "google"
            ? "جاري تسجيل الدخول عبر Google..."
            : "جاري تسجيل الدخول عبر Facebook..."
        );

        const redirectUri = `${window.location.origin}/auth/callback/${provider}`;

        const res = await socialLogin({
          provider: provider as "google" | "facebook",
          code: code,
          redirect_uri: redirectUri,
        });

        if (res.success) {
          setStatusText("تم تسجيل الدخول بنجاح! جاري تحويلك...");
          router.push("/profile");
          router.refresh();
        } else {
          setError(res.error || "فشل تسجيل الدخول عبر الحساب الاجتماعي");
        }
      } catch (err: any) {
        setError(err?.message || "حدث خطأ غير متوقع أثناء معالجة تسجيل الدخول");
      }
    };

    processAuth();
  }, [code, errorParam, errorDescription, provider, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 sm:p-8 text-center border border-gray-100 dark:border-zinc-800">
        {error ? (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">فشل تسجيل الدخول</h2>
            <p className="text-sm text-gray-600 dark:text-zinc-400">{error}</p>
            <div className="pt-4">
              <Link
                href="/auth"
                className="inline-block px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition"
              >
                العودة لصفحة تسجيل الدخول
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
            <h2 className="text-base sm:text-lg font-medium text-gray-800 dark:text-zinc-200">
              {statusText}
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              يرجى الانتظار بضع لحظات...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
