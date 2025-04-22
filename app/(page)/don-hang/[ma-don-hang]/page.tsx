'use client'

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import DonHangPage from "@/app/components/donhang/donHangPage"
import { Loader2 } from "lucide-react"

const DonHPage = () => {
  const param = useParams()
  const { "ma-don-hang": maDonHang } = param as { "ma-don-hang": string }

  const [donHang, setDonHang] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDonHang = async () => {
      try {
        const res = await fetch(`/api/don-hang/${maDonHang}`, {
          method: 'GET',
          cache: 'no-store',
        })

        if (!res.ok) {
          throw new Error("Không thể lấy thông tin đơn hàng")
        }

        const data = await res.json()
        setDonHang(data)
      } catch (err: any) {
        setError(err.message)
      }
    }

    if (maDonHang) {
      fetchDonHang()
    }
  }, [maDonHang])

  if (error) return <div>Lỗi: {error}</div>
  if (!donHang) return (
    <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">Đang kiểm tra phiên đăng nhập...</p>
    </div>
  );

  return (
    <DonHangPage data={donHang}></DonHangPage>
  )
}

export default DonHPage
