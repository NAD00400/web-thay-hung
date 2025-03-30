
import CartActions from "@/app/components/giohang/giohang.action";
import { getCartItems } from "@/app/lib/seed";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default async function GioHang() {
    const cartItems = await getCartItems();
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="container mx-auto p-4 mt-16">
            <h1 className="text-2xl font-bold mb-4">Giỏ Hàng</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <Card key={item.id} className="shadow-lg">
                            <CardHeader>
                                <CardTitle>{item.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Giá: {item.price.toLocaleString()} VND</p>
                                <p>Số lượng: {item.quantity}</p>
                            </CardContent>
                            <CardFooter>
                                <CartActions itemId={item.id} />
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-3">Giỏ hàng trống</p>
                )}
            </div>
            <div className="mt-6 p-4 border-t">
                <h2 className="text-xl font-semibold">Tổng cộng: {totalPrice.toLocaleString()} VND</h2>
                {cartItems.length > 0 && <CartActions isCheckout />}
            </div>
        </div>
    );
}
