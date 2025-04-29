import { prisma } from '@/app/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';




// GET API: Fetch a product by its ID with optional searchParams
export async function GET(req: NextRequest, { params }: { params: { 'id': string } }) {
    const { 'id': maSanPham } = params;
    const searchParams = req.nextUrl.searchParams;

    try {
        const product = await prisma.sanPhamDatMay.findUnique({
            where: { ma_san_pham_dat_may: maSanPham },
            include: {
                danh_muc: true,
                phu_lieu_may_mac: true,
            },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Example: Use searchParams if needed
        const filter = searchParams.get('filter');
        if (filter) {
            // Apply additional filtering logic here
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

// PUT API: Update a product by its ID
export async function PUT(req: NextRequest, { params }: { params: { 'ma-san-pham': string } }) {
    const { 'ma-san-pham': maSanPham } = params;
    const {co_san,gia_tien,mo_ta_san_pham,ten_san_pham,url_image} = await req.json();

    try {
        const updatedProduct = await prisma.sanPhamDatMay.update({
            where: { ma_san_pham_dat_may: maSanPham },
            data: {co_san,gia_tien,mo_ta_san_pham,ten_san_pham,url_image},
        });

        return NextResponse.json(updatedProduct);
    } 
    catch(error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

// DELETE API: Delete a product by its ID
// DELETE: /api/san-pham/[ma-san-pham]
export async function DELETE(
    req: NextRequest,
    { params }: { params: { 'ma-san-pham': string } }
  ) {
    const { 'ma-san-pham': maSanPham } = params;
  
    try {
      // Kiểm tra xem có đơn hàng nào chứa sản phẩm không
      const chiTietDonHangs = await prisma.chiTietDonHang.findMany({
        where: {
          ma_san_pham: maSanPham,
        },
        include: {
          don_hang: {
            include: {
              khach_hang: true,
            },
          },
        },
      });
  
      if (chiTietDonHangs.length > 0) {
        return NextResponse.json(
          {
            error: 'Sản phẩm đang nằm trong đơn hàng',
            soLuongDonHang: chiTietDonHangs.length,
            danhSachDonHang: chiTietDonHangs.map((ct) => ({
              maDonHang: ct.ma_don_hang,
              tenKhachHang: ct.don_hang.khach_hang.ten_khach_hang,
            })),
          },
          { status: 400 }
        );
      }
  
      // Nếu không nằm trong đơn hàng thì xóa
      await prisma.sanPhamDatMay.delete({
        where: { ma_san_pham_dat_may: maSanPham },
      });
  
      return NextResponse.json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
      console.error('[DELETE ERROR]', error);
      return NextResponse.json({ error: 'Lỗi khi xóa sản phẩm' }, { status: 500 });
    }
  }
  