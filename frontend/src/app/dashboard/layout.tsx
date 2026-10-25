import { UserNav } from "../../components/dashboard/user-nav";
import { Sidebar } from "../../components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 flex-col" dir="rtl">
      <div className="border-b flex justify-between">
        <div className="flex h-16 items-center px-4">
        <h1 className="text-center text-xl font-bold">
                لوحة تحكم منصة لنتطوع
            </h1>
        </div>
        <div className="flex items-center space-x-4 px-4">
          <UserNav />
        </div>
      </div>
      <div className="flex flex-1 flex-row">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
