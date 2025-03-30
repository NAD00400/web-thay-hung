import OrderForm from "@/app/components/dathang/dathang.form";


export default function DatHangPage() {
    const products = [
        { id: 1, name: "Sản phẩm A", price: 100000, quantity: 1 },
        { id: 2, name: "Sản phẩm B", price: 200000, quantity: 2 },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center mt-14">
            <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Đặt Hàng</h1>

                {/* Product Details */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">Chi tiết sản phẩm</h2>
                    <div className="space-y-2">
                        {products.map((product) => (
                            <div key={product.id} className="p-4 border rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-600">Số lượng: {product.quantity}</p>
                                </div>
                                <p className="font-bold">{product.price.toLocaleString()}₫</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Form */}
                <OrderForm />
            </div>
        </div>
    );
}
