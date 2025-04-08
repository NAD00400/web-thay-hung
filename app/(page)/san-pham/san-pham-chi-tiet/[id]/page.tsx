
import ProductDetailClient from '@/app/components/sanpham/sanpham.detail';
import { fetchSanPhamChiTiet } from '@/app/lib/fetchData';
import { notFound } from 'next/navigation';

interface ProductDetailProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const product = await fetchSanPhamChiTiet(params.id);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
