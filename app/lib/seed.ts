export async function getCartItems() {
    // Giả lập gọi API hoặc database
    return [
        { id: 1, name: "Product 1", price: 100, quantity: 2 },
        { id: 2, name: "Product 2", price: 200, quantity: 1 },
    ];
}
export function calculateTotal(cartItems: { price: number; quantity: number }[]) {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}
