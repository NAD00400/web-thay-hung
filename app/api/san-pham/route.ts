import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// /c:/Thư mục mới/my production/học tập - NestJs/nhom-13/app/api/san-pham/route.ts
// viết api get, post prisma cho sản phẩm dùng next js tsts app router với hàm handle tách riêng

const prisma = new PrismaClient();

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    try {
        const products = await prisma.sanPhamDatMay.findMany();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        await prisma.sanPhamDatMay.delete({
            where: { ma_san_pham_dat_may: id as string },
        });
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const {
            ten_san_pham,
            mo_ta_san_pham,
            gia_tien,
            url_image,
            co_san,
            ma_danh_muc,
            ma_phu_lieu,
            danh_muc
        } = req.body;
        const updatedProduct = await prisma.sanPhamDatMay.update({
            where: { ma_san_pham_dat_may: id as string },
            data: {
                ten_san_pham,
                mo_ta_san_pham,
                gia_tien,
                url_image,
                co_san,
                ma_danh_muc,
                ma_phu_lieu,
                danh_muc: {
                    connect: { ma_danh_muc: danh_muc.ma_danh_muc },
                },
            },
        });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
}
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { 
            ten_san_pham,
            mo_ta_san_pham,
            gia_tien,
            url_image,
            co_san,
            ma_danh_muc,
            ma_phu_lieu,
            danh_muc
        } = req.body;
        const newProduct = await prisma.sanPhamDatMay.create({
            data: {
                ten_san_pham,
                mo_ta_san_pham,
                gia_tien,
                url_image,
                co_san,
                ma_danh_muc,
                ma_phu_lieu,
                danh_muc: {
                    connect: { ma_danh_muc: danh_muc.ma_danh_muc },
                },
            }
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            await handleGet(req, res);
            break;
        case 'POST':
            await handlePost(req, res);
            break;
        case 'DELETE':
            await handleDelete(req, res);
            break;
        case 'PUT':
            await handlePut(req, res);
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}