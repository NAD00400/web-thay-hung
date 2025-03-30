import CheckoutButton from "@/app/components/dathang.oder";
import RemoveFromCartButton from "@/app/components/dathang.rmtbn";
import { calculateTotal, getCartItems } from "@/app/lib/seed";


export default async function CartPage() {
    const cartItems = await getCartItems();

    return (
        <div className="container mx-auto p-4 mt-8">
            <h1 className="text-2xl font-bold mb-4">Giỏ Hàng</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <div key={item.id} className="shadow-lg p-4 border rounded-lg">
                            <h2 className="font-bold">{item.name}</h2>
                            <p>Giá: {item.price.toLocaleString()} VND</p>
                            <p>Số lượng: {item.quantity}</p>
                            <RemoveFromCartButton itemId={item.id} />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-3">Giỏ hàng trống</p>
                )}
            </div>
            <div className="mt-6 p-4 border-t">
                <h2 className="text-xl font-semibold">Tổng cộng: {calculateTotal(cartItems).toLocaleString()} VND</h2>
                {cartItems.length > 0 && <CheckoutButton />}
            </div>
        </div>
    );
}
