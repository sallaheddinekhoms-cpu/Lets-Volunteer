"use server"

import { Backend } from "@/lib/helper";
import { cookies } from "next/headers";

interface SocialLoginParams {
  provider: "google" | "facebook";
  code?: string;
  redirect_uri?: string;
  access_token?: string;
  id_token?: string;
  is_mock?: boolean;
  email?: string;
  first_name?: string;
  last_name?: string;
  user_type?: "volunteer" | "organization";
}

export async function socialLogin(params: SocialLoginParams) {
  try {
    const endpoint = `auth/social/${params.provider}/`;
    const { data, status } = await Backend.post(endpoint, {
      body: {
        code: params.code,
        redirect_uri: params.redirect_uri,
        access_token: params.access_token,
        id_token: params.id_token,
        is_mock: params.is_mock,
        email: params.email,
        first_name: params.first_name,
        last_name: params.last_name,
        user_type: params.user_type || "volunteer",
      },
    });

    if (status === 200 && data?.access && data?.refresh) {
      const cookieStore = await cookies();
      cookieStore.set("access", data.access, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      cookieStore.set("refresh", data.refresh, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      return {
        success: true,
        message: data.message || "تم تسجيل الدخول بنجاح",
        user: data.user,
      };
    }

    return {
      success: false,
      error: data?.error || "فشل تسجيل الدخول عبر الحساب الاجتماعي",
    };
  } catch (error: any) {
    console.error("Social login error:", error);
    return {
      success: false,
      error: error?.message || "حدث خطأ غير متوقع أثناء الاتصال بالخادم",
    };
  }
}
