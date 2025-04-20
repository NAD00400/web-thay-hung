"use client";

import { onAuthStateChanged } from "@firebase/auth";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { auth } from "./firebase";
import { Loader2 } from "lucide-react";

// Đây là kiểu dữ liệu từ backend, bạn có thể tùy chỉnh
interface UserContextType {
  user: any | null; // nếu bạn có interface riêng cho user backend, hãy thay thế "any"
  setUser: (user: any | null) => void;
  signOut: () => void;
}
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  signOut: () => {},
});
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const res = await fetch(`/api/khach-hang/firebase/${firebaseUser.uid}`);
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setIsLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  
  


if (isLoading) {
  return (
    <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">Đang kiểm tra phiên đăng nhập...</p>
    </div>
  );
}

  
  const signOut = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
