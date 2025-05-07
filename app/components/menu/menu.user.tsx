import { useUser } from '../../lib/context'; // Đảm bảo đường dẫn đúng đến file context
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';


const HeaderComponent: React.FC = () => {
  const { user, signOut } = useUser(); // Lấy thông tin người dùng từ context
  const router = usePathname();
  const [showAlert, setShowAlert] = useState(false);

  const isActive = (path: string) => router === path;

  useEffect(() => {
    if (user) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 1200); // Ẩn thông báo sau 3 giây
    }
  }, [user]);

  const navLinks = [
    { href: '/', label: 'Trang Chủ' },
    { href: '/san-pham', label: 'Sản Phẩm' },
  ];

  const authLinks = user
    ? [
        { href: '/gio-hang', label: 'Giỏ Hàng' },
        { href: '#', label: 'Đăng Xuất', onClick: () => signOut() },
      ]
    : [
        { href: '/gio-hang', label: 'Giỏ Hàng' },
        { href: '/dang-nhap', label: 'Đăng Nhập' },
      ];

  const renderLinks = (links: { href: string; label: string; onClick?: () => void }[]) =>
    links.map(({ href, label, onClick }) => (
      <li key={href}>
        <Link
          href={href}
          className={`text-gray-50 hover:text-white ${isActive(href) ? 'text-white font-bold' : ''}`}
          onClick={onClick}
        >
          {label}
        </Link>
      </li>
    ));

  

  return (
    <>
      
      <header className="py-4 opacity-70 fixed top-0 left-0 w-full backdrop-blur-md z-50 transition-all duration-300" 
      style={{
        backgroundImage: "url('https://brojqgdjcljbprhn.public.blob.vercel-storage.com/imgBg/vibrant-liquid-wavy-background-3d-illustration-abstract-iridescent-fluid-render-neon-holographic-smooth-surface-with-colorful-interference-stylish-spectrum-flow-motion-It87UUpTtxvIn7SKkuFrNfu4d2Mi2m.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}>
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-xl font-bold text-white">Nhà May Thiên Kim</h1>
          <div className="flex items-center space-x-8">
            <nav>
              <ul className="flex space-x-6 ">{renderLinks(navLinks)}</ul>
            </nav>
            <nav>
              <ul className="flex space-x-6">{renderLinks(authLinks)}</ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderComponent;
