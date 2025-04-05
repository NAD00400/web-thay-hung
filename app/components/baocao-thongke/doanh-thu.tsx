'use client';
import React, { useState, useEffect } from 'react';

interface Invoice {
    id: string;
    date: string; // ISO format
    totalAmount: number;
    status: 'paid' | 'unpaid' | 'pending';
    paymentMethod: 'ZaloPay' | 'BankTransfer' | 'Cash';
}

interface RevenueReportProps {
    invoices: Invoice[];
}

const RevenueReport: React.FC<RevenueReportProps> = ({ invoices }) => {
    const [filter, setFilter] = useState<'day' | 'month' | 'year'>('month');
    const [report, setReport] = useState({
        totalPaid: 0,
        totalUnpaid: 0,
        totalPending: 0,
        paymentMethods: {
            ZaloPay: 0,
            BankTransfer: 0,
            Cash: 0,
        },
    });

    useEffect(() => {
        // Calculate report based on invoices
        const calculateReport = () => {
            const filteredInvoices = invoices.filter((invoice) => {
                const date = new Date(invoice.date);
                const now = new Date();

                if (filter === 'day') {
                    return date.toDateString() === now.toDateString();
                } else if (filter === 'month') {
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                } else if (filter === 'year') {
                    return date.getFullYear() === now.getFullYear();
                }
                return false;
            });

            const totalPaid = filteredInvoices
                .filter((invoice) => invoice.status === 'paid')
                .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

            const totalUnpaid = filteredInvoices
                .filter((invoice) => invoice.status === 'unpaid')
                .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

            const totalPending = filteredInvoices
                .filter((invoice) => invoice.status === 'pending')
                .reduce((sum, invoice) => sum + invoice.totalAmount, 0);

            const paymentMethods = filteredInvoices.reduce(
                (methods, invoice) => {
                    methods[invoice.paymentMethod] += invoice.totalAmount;
                    return methods;
                },
                { ZaloPay: 0, BankTransfer: 0, Cash: 0 }
            );

            setReport({ totalPaid, totalUnpaid, totalPending, paymentMethods });
        };

        calculateReport();
    }, [invoices, filter]);

    return (
        <div>
            <h1>Thống kê doanh thu & thanh toán</h1>
            <div>
                <label>Lọc theo: </label>
                <select value={filter} onChange={(e) => setFilter(e.target.value as 'day' | 'month' | 'year')}>
                    <option value="day">Ngày</option>
                    <option value="month">Tháng</option>
                    <option value="year">Năm</option>
                </select>
            </div>
            <div>
                <h2>Báo cáo</h2>
                <p>Tổng tiền đã thanh toán: {report.totalPaid.toLocaleString()} VND</p>
                <p>Tổng tiền chưa thanh toán: {report.totalUnpaid.toLocaleString()} VND</p>
                <p>Tổng tiền chờ xác nhận: {report.totalPending.toLocaleString()} VND</p>
                <h3>Theo phương thức thanh toán:</h3>
                <ul>
                    <li>ZaloPay: {report.paymentMethods.ZaloPay.toLocaleString()} VND</li>
                    <li>Chuyển khoản: {report.paymentMethods.BankTransfer.toLocaleString()} VND</li>
                    <li>Tiền mặt: {report.paymentMethods.Cash.toLocaleString()} VND</li>
                </ul>
            </div>
        </div>
    );
};

export default RevenueReport;
