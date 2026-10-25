import { ResetPassword } from "@/components/auth/reset-password/reset-password"

interface ResetPasswordPageProps {
  searchParams: Promise<{ token: string }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <ResetPassword token={token} />
      </div>
    </div>
  )
}
