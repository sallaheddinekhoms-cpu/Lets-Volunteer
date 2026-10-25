"use client"
import { logout } from "@/actions/logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const UserNav = () => {

  const [isPending , startTransition] = useTransition()
  const router = useRouter();

const handleLogout = () => {
    startTransition(() => {
      
      logout().then(() => router.push("/"))
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative bg-white h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/black_logo.svg" alt="صورة المستخدم" />
            <AvatarFallback>مدير</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 text-right">
            <p className="text-sm font-medium leading-none">مدير النظام</p>
            <p className="text-xs leading-none text-muted-foreground">
              admin@lets-volunteer-dz.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-right">
          <Button disabled={isPending} variant="ghost" onClick={handleLogout}
                      className=" text-red-500 hover:text-red-700 hover:bg-red-50">
                      {isPending ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
