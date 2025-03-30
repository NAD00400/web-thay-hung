import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

"use client";

const AdminSanPhamPage = () => {
    const [products, setProducts] = useState([
        { id: 1, name: "Sản phẩm 1", price: 100000 },
        { id: 2, name: "Sản phẩm 2", price: 200000 },
    ]);

    const handleAddProduct = () => {
        const newProduct = {
            id: products.length + 1,
            name: `Sản phẩm ${products.length + 1}`,
            price: 0,
        };
        setProducts([...products, newProduct]);
    };

    const handleDeleteProduct = (id: number) => {
        setProducts(products.filter((product) => product.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="container mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-700">Quản Lý Sản Phẩm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <Button onClick={handleAddProduct} variant="outline">
                                Thêm Sản Phẩm
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Tên Sản Phẩm</TableHead>
                                    <TableHead>Giá</TableHead>
                                    <TableHead>Hành Động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.price.toLocaleString()} VND</TableCell>
                                        <TableCell>
                                            <Button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                variant="destructive"
                                                size="sm"
                                            >
                                                Xóa
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminSanPhamPage;