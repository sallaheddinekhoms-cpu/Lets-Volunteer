"use client"

import { BadgeAlertIcon, Building, Handshake, HeartHandshake, House, Newspaper, Users, Video, Megaphone, Mail, PackageSearch } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/dashboard",
      label: "الرئيسية",
      icon : <House className="w-5 h-5" />
    },
    {
      href: "/dashboard/organizations",
      label: "الهيئات",
      icon : <Building className="w-5 h-5" />
    },
    {
      href: "/dashboard/volunteers",
      label: "المتطوعين",
      icon : <Users className="w-5 h-5" />
    },
    {
      href: "/dashboard/opportunities",
      label: "الفرص التطوعية",
      icon : <Handshake className="w-5 h-5" />
    },
    {
      href: "/dashboard/categories",
      label: "التصنيفات",
      icon : <BadgeAlertIcon className="w-5 h-5" />
    },
    {
      href: "/dashboard/aids",
      label: "النشاطات الاجتماعية",
      icon :<HeartHandshake className="w-5 h-5" />
    },
    {
      href: "/dashboard/blog",
      label: "المدونة",
      icon : <Newspaper className="w-5 h-5" />
    },
    {
      href : "/dashboard/partners",
      label: "الشركاء",
      icon : <Building className="w-5 h-5" />
    },
    {
      href: "/dashboard/videos",
      label: "الفيديوهات",
      icon: <Video className="w-5 h-5" />
    },
    {
      href: "/dashboard/announcements",
      label: "الإعلانات",
      icon: <Megaphone className="w-5 h-5" />
    },
    {
      href: "/dashboard/messages",
      label: "رسائل التواصل",
      icon: <Mail className="w-5 h-5" />
    },
    {
      href: "/dashboard/solidarity-requests",
      label: "طلبات المتجر",
      icon: <PackageSearch className="w-5 h-5" />
    }
  ];

  return (
    <nav className="w-64 border-r bg-white p-4">
      <div className="space-y-1">
        {routes.map((route) => (
          <Link
            href={route.href}
            key={route.href}
            className={`flex items-center gap-2 rounded-lg px-6 py-4 text-xl font-medium ${
              pathname === route.href
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {route.icon}
            {route.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
