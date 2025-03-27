import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return getSoDo(req, res);
        case 'POST':
            return createSoDo(req, res);
        case 'DELETE':
            return deleteSoDo(req, res);
        case 'PUT':
            return updateSoDo(req, res);
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function getSoDo(req: NextApiRequest, res: NextApiResponse) {
    try {
        const soDo = await prisma.soDoDatMay.findMany();
        res.status(200).json(soDo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch soDo' });
    }
}

async function updateSoDo(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const updatedData = req.body;
        const updatedSoDo = await prisma.soDoDatMay.update({
            where: { ma_so_do: id as string },
            data: updatedData,
        });
        res.status(200).json(updatedSoDo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update soDo' });
    }
}

async function deleteSoDo(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        await prisma.soDoDatMay.delete({
            where: { ma_so_do: id as string },
        });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete soDo' });
    }
}

async function createSoDo(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { 
            vong_nguc,
            vong_co,
            vong_eo,
            be_ngang_vai,
            vong_hong,
            chieu_dai_ao,        
            chieu_dai_tu_vai_toi_eo, 
            chieu_dai_tay_ao  ,      
            vong_bap_tay,            
            vong_khuy_tay,          
            vong_co_tay,             
            chieu_dai_quan,          
            createdAt,               
            vong_dui,                
            vong_dau_goi,            
            vong_ong_quan,
            ma_chi_tiet_don_hang,           
} = req.body;
        const newSoDo = await prisma.soDoDatMay.create({
            data: {
                vong_nguc,
                vong_co,
                vong_eo,
                be_ngang_vai,
                vong_hong,
                chieu_dai_ao,        
                chieu_dai_tu_vai_toi_eo, 
                chieu_dai_tay_ao,      
                vong_bap_tay,            
                vong_khuy_tay,          
                vong_co_tay,             
                chieu_dai_quan,          
                createdAt,               
                vong_dui,                
                vong_dau_goi,            
                vong_ong_quan,           
                ma_chi_tiet_don_hang,
            },
        });
        res.status(201).json(newSoDo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create soDo' });
    }
}