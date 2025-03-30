import AdminMenu from "@/app/components/menu/menu.admin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-indigo-300">
      {/* Menu bên trái */}
      <AdminMenu />

      {/* Nội dung bên phải */}
      <div className="flex-1 bg-indigo-300">
        {children}
      </div>
    </div>
  );
}
