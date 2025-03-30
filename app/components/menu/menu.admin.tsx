'use client'
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboardIcon, ListOrderedIcon, User2Icon, Package2Icon, MenuIcon, LogOutIcon } from "lucide-react";

const menuItems = [
  { name: "Đánh giá", href: "/admin/danh-giagia", icon: LayoutDashboardIcon },
  { name: "Đơn Hàng", href: "/admin/don-hang", icon: ListOrderedIcon },
  { name: "Khách Hàng", href: "/admin/khach-hang", icon: User2Icon },
  { name: "Sản Phẩm", href: "/admin/san-pham", icon: Package2Icon },
];

const AdminMenu = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  return (
    <aside className={cn(
      "h-screen transition-all duration-300 backdrop-blur-lg bg-white/10 border border-white/20 flex flex-col",
      isOpen ? "w-64" : "w-20"
    )}>
      {/* Toggle Sidebar */}
      <div className="p-4 pl-6 flex items-center justify-between">
        <span className={cn("text-white text-lg font-bold", !isOpen && "hidden")}>
          Admin Panel
        </span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:opacity-80">
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-5 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-md transition-all duration-200 text-white",
                "hover:bg-white/20",
                isActive ? "bg-white/30" : "bg-transparent"
              )}
            >
              <Icon className="w-6 h-6" />
              {isOpen && <span className="text-md">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-[19px] border-t border-white/20 flex items-center justify-between text-sm text-gray-200">
        {isOpen && <span>© 2025 Admin</span>}
        <Link href="/" className="flex items-center gap-1 text-white hover:text-red-500">
          <LogOutIcon className="w-6 h-6" />
        </Link>
      </div>
    </aside>
  );
};

export default AdminMenu;
