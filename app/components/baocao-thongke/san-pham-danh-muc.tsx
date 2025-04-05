import React, { useEffect, useState } from 'react';

interface Product {
    id: number;
    name: string;
    category: string;
    orders: { date: string; quantity: number }[];
    stock: number;
}

interface CategoryStats {
    category: string;
    productCount: number;
}

interface TopProduct {
    name: string;
    totalOrders: number;
}

interface SanPhamDanhMucProps {
    products: Product[];
}

const SanPhamDanhMuc: React.FC<SanPhamDanhMucProps> = ({ products }) => {
    const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
    const [topProduct, setTopProduct] = useState<TopProduct | null>(null);
    const [stockStatus, setStockStatus] = useState<{ inStock: number; outOfStock: number }>({
        inStock: 0,
        outOfStock: 0,
    });

    useEffect(() => {
        // Calculate category statistics
        const categoryMap: Record<string, number> = {};
        products.forEach((product) => {
            categoryMap[product.category] = (categoryMap[product.category] || 0) + 1;
        });
        const stats = Object.entries(categoryMap).map(([category, productCount]) => ({
            category,
            productCount,
        }));
        setCategoryStats(stats);

        // Find top product
        const productOrders = products.map((product) => ({
            name: product.name,
            totalOrders: product.orders.reduce((sum, order) => sum + order.quantity, 0),
        }));
        const top = productOrders.reduce((prev, current) =>
            current.totalOrders > prev.totalOrders ? current : prev,
        );
        setTopProduct(top);

        // Calculate stock status
        const inStock = products.filter((product) => product.stock > 0).length;
        const outOfStock = products.filter((product) => product.stock === 0).length;
        setStockStatus({ inStock, outOfStock });
    }, [products]);

    return (
        <div>
            <h1>Thống kê sản phẩm & danh mục</h1>

            <section>
                <h2>Số lượng sản phẩm trong mỗi danh mục</h2>
                <ul>
                    {categoryStats.map((stat) => (
                        <li key={stat.category}>
                            {stat.category}: {stat.productCount} sản phẩm
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Sản phẩm được đặt nhiều nhất</h2>
                {topProduct ? (
                    <p>
                        {topProduct.name} với {topProduct.totalOrders} đơn đặt hàng
                    </p>
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </section>

            <section>
                <h2>Tình trạng kho hàng & phụ liệu may mặc</h2>
                <p>Sản phẩm còn hàng: {stockStatus.inStock}</p>
                <p>Sản phẩm hết hàng: {stockStatus.outOfStock}</p>
            </section>
        </div>
    );
};

export default SanPhamDanhMuc;
