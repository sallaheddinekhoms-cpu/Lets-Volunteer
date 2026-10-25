import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { checkAuthentication, isOrganization } from "@/utils/auth";
import { ToastContainer } from 'react-toastify'
import Wrapper from "./wrapper";
export const dynamic = 'force-dynamic'

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "لنتطوع",
  description: "المنصة التطوعية الاولى في الجزائر",
  icons: {
    icon: "logo.svg"
  },

};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { isAuthenticated } = await checkAuthentication();

  const is_organization = await isOrganization();


  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.className} antialiased`}
      >
        <Wrapper  isAuthenticated={isAuthenticated} is_organization={is_organization}>

        
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          draggable
          theme="light"
        
        />
        {children}

        </Wrapper>
      </body>
    </html>
  );
}
