'use client';

import { cn } from "@/lib/utils";
import { MessageSquareText, LayoutDashboardIcon, ListOrderedIcon, LogOutIcon, MenuIcon, Package2Icon, User2Icon, Calendar1Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Lịch Hẹn", href: "/admin/lich-hen", icon: Calendar1Icon },
  { name: "Đơn Hàng", href: "/admin/don-hang", icon: ListOrderedIcon },
  { name: "Khách Hàng", href: "/admin/khach-hang", icon: User2Icon },
  { name: "Sản Phẩm", href: "/admin/san-pham", icon: Package2Icon },
  { name: "Giao Hàng", href: "/admin/giao-hang", icon: MessageSquareText },
];

const AdminMenu = () => {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border-b border-white/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo / Title */}
        <div className="text-white text-lg font-bold">
          Admin Panel
        </div>

        {/* Menu Items */}
        <div className="flex items-center gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-white text-sm font-medium hover:text-blue-400 transition-all",
                  isActive && "underline underline-offset-4 text-blue-400"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <Link href="/" className="text-white hover:text-red-500 transition-all">
          <LogOutIcon className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
};

export default AdminMenu;
