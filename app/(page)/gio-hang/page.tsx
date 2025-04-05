// import CartActions from "@/app/components/giohang/giohang.action";
// import { useUser } from "@/app/lib/context";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


// async function getCartItems(customerId: string) {
//     const response = await fetch(`${process.env.BASE_URL}/gio-hang/${customerId}`, {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         cache: "no-store",
//     });
//     if (!response.ok) {
//         throw new Error("Failed to fetch cart items");
//     }
//     return response.json();
// }

// import { useEffect, useState } from "react";

// export default function GioHang() {
//     const { user, loading } = useUser(); // Assuming you have a UserContext to get the user info
//     const [cartItems, setCartItems] = useState<{ id: number; name: string; price: number; quantity: number; }[]>([]);
//     const [totalPrice, setTotalPrice] = useState(0);

//     useEffect(() => {
//         if (!user || loading) return;

//         const fetchCartItems = async () => {
//             try {
//                 const firebaseId = user.uid; // Assuming `uid` is the Firebase ID
//                 const userResponse = await fetch(`${process.env.BASE_URL}/nguoi-dungg/${firebaseId}`, {
//                     method: "GET",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     cache: "no-store",
//                 });

//                 if (!userResponse.ok) {
//                     throw new Error("Failed to fetch user data");
//                 }

//                 const userData = await userResponse.json();
//                 const customerId = userData.customerId; // Assuming the API returns `customerId`
//                 if (!customerId) {
//                     throw new Error("Customer ID not found");
//                 }

//                 const items = await getCartItems(customerId);
//                 setCartItems(items);
//                 const total = items.reduce((total: number, item: { price: number; quantity: number; }) => total + item.price * item.quantity, 0);
//                 setTotalPrice(total);
//             } catch (error) {
//                 console.error(error);
//             }
//         };

//         fetchCartItems();
//     }, [user, loading]);
//     // Removed duplicate declaration of totalPrice

//     return (
//         <div className="container mx-auto p-4 mt-16">
//             <h1 className="text-2xl font-bold mb-4">Giỏ Hàng</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {cartItems.length > 0 ? (
//                     cartItems.map((item) => (
//                         <Card key={item.id} className="shadow-lg">
//                             <CardHeader>
//                                 <CardTitle>{item.name}</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <p>Giá: {item.price.toLocaleString()} VND</p>
//                                 <p>Số lượng: {item.quantity}</p>
//                             </CardContent>
//                             <CardFooter>
//                                 <CartActions itemId={item.id} />
//                             </CardFooter>
//                         </Card>
//                     ))
//                 ) : (
//                     <p className="text-center text-gray-500 col-span-3">Giỏ hàng trống</p>
//                 )}
//             </div>
//             <div className="mt-6 p-4 border-t">
//                 <h2 className="text-xl font-semibold">Tổng cộng: {totalPrice.toLocaleString()} VND</h2>
//                 {cartItems.length > 0 && <CartActions isCheckout />}
//             </div>
//         </div>
//     );
// }
