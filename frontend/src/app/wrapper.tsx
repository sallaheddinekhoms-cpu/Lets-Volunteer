"use client";

import Footer from "@/components/landing/footer";
import { Navbar } from "@/components/navbar";
import { usePathname } from "next/navigation";
import { LanguageProvider } from "@/context/LanguageContext";

const Wrapper = ({
  children,
  is_organization,
  isAuthenticated,
}: Readonly<{
  children: React.ReactNode;
  isAuthenticated: boolean;
  is_organization: boolean;
}>) => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <LanguageProvider>
      {!isDashboard && (
        <Navbar
          isAuthenticated={isAuthenticated}
          isOrganization={is_organization}
        />
      )}
      <main>{children}</main>
      {!isDashboard && <Footer />}
    </LanguageProvider>
  );
};

export default Wrapper;
