import React, { useEffect, useState } from 'react';

interface CustomerStats {
    newCustomersByMonth: { month: string; count: number }[];
    topCustomers: { name: string; orders: number }[];
    repeatCustomerRate: number; // Percentage
}

interface KhachHangThongKeProps {
    stats: CustomerStats;
}

const KhachHangThongKe: React.FC<KhachHangThongKeProps> = ({ stats }) => {
    const [localStats, setLocalStats] = useState<CustomerStats | null>(null);

    useEffect(() => {
        setLocalStats(stats);
    }, [stats]);

    if (!localStats) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Thống kê khách hàng</h1>
            <section>
                <h2>Số lượng khách hàng mới theo tháng</h2>
                <ul>
                    {localStats.newCustomersByMonth.map((item) => (
                        <li key={item.month}>
                            {item.month}: {item.count} khách hàng mới
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>Danh sách khách hàng có nhiều đơn hàng nhất</h2>
                <ul>
                    {localStats.topCustomers.map((customer, index) => (
                        <li key={index}>
                            {customer.name}: {customer.orders} đơn hàng
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>Tỷ lệ khách hàng quay lại mua hàng</h2>
                <p>{localStats.repeatCustomerRate}%</p>
            </section>
        </div>
    );
};

export default KhachHangThongKe;