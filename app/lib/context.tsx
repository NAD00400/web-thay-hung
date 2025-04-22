import { onAuthStateChanged, signOut as firebaseSignOut } from "@firebase/auth";
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
  const [user, setUser] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const res = await fetch(`/api/khach-hang/firebase/${firebaseUser.uid}`);
        const data = await res.json();
        setUser(data); // Cập nhật context
        localStorage.setItem("user", JSON.stringify(data)); // Lưu vào localStorage nếu cần
      } else {
        setUser(null); // Nếu không có user, đặt lại context
        localStorage.removeItem("user"); // Xóa thông tin user trong localStorage
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Clean up khi component unmount
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Đang kiểm tra phiên đăng nhập...</p>
      </div>
    );
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth); // Đăng xuất khỏi Firebase
      setUser(null); // Cập nhật lại context khi đăng xuất
      localStorage.removeItem("user"); // Xóa user trong localStorage khi đăng xuất
      console.log("Đăng xuất thành công");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
