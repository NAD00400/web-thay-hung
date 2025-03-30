"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line,
  PieChart, Pie, Cell, Legend
} from "recharts";

const AdminIntro = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  // Dữ liệu giả lập
  const dummyStats = [
    { title: "Đơn hàng mới", value: 12 },
    { title: "Khách hàng", value: 58 },
    { title: "Doanh thu hôm nay", value: "12.000.000 VND" }
  ];

  const dummyOrders = [
    { name: "Tháng 1", orders: 30 },
    { name: "Tháng 2", orders: 45 },
    { name: "Tháng 3", orders: 50 },
    { name: "Tháng 4", orders: 70 }
  ];

  const dummyCustomers = [
    { name: "Tháng 1", customers: 10 },
    { name: "Tháng 2", customers: 15 },
    { name: "Tháng 3", customers: 20 },
    { name: "Tháng 4", customers: 30 }
  ];

  const dummyRevenue = [
    { name: "May đo", value: 5000000 },
    { name: "Sửa chữa", value: 3000000 },
    { name: "Bán sẵn", value: 4000000 }
  ];

  const COLORS = ["#003049", "#C1121F", "#669BBC"];

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {dummyStats.map((stat, index) => (
        <Card key={index} className="shadow-md">
          <CardHeader>
            <CardTitle>{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-6 w-24" /> : <p className="text-2xl font-bold">{stat.value}</p>}
          </CardContent>
        </Card>
      ))}

      {/* Biểu đồ cột: Đơn hàng */}
      <Card className="col-span-1 shadow-md">
        <CardHeader>
          <CardTitle>Thống kê đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dummyOrders}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#003049" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Biểu đồ đường: Khách hàng */}
      <Card className="col-span-1 shadow-md">
        <CardHeader>
          <CardTitle>Khách hàng theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dummyCustomers}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="customers" stroke="#C1121F" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Biểu đồ tròn: Doanh thu */}
      <Card className="col-span-1 shadow-md">
        <CardHeader>
          <CardTitle>Tỉ lệ doanh thu</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dummyRevenue}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {dummyRevenue.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminIntro;
