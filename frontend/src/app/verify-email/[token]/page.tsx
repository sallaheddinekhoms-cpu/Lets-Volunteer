import VerifyEmail from "@/components/auth/VerifyEmail";

export default async function VerifyEmailWrapper({
  params,
}: {
  params: Promise<{token:string}>
}) {

      const {token} = await params
  return <VerifyEmail token={token} />;
}