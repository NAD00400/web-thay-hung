"use client";

import {createContext,useContext,useEffect,useState,ReactNode} from "react";
import {User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";

interface UserContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
    setUser: function (user: User | null): void {
        throw new Error("Function not implemented.");
    }
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSavedToDB, setHasSavedToDB] = useState(false); // tránh gọi API nhiều lần

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user && !hasSavedToDB) {
        try {
          // Gọi API backend để lưu thông tin người dùng
          await fetch("/api/nguoi-dung", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ma_nguoi_dung: user.uid,
              email_nguoi_dung: user.email,
              ten_nguoi_dung: user.displayName,
              link_anh_dai_dien: user.photoURL,
              vai_tro: "KHACH_HANG", // Hoặc vai trò khác tùy theo yêu cầu
              firebaseId: user.uid,
            }),
          });

          setHasSavedToDB(true);
        } catch (error) {
          console.error("Lỗi khi lưu user vào DB:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [hasSavedToDB]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setHasSavedToDB(false);
  };

  return (
    <UserContext.Provider value={{ user, loading, signOut, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
