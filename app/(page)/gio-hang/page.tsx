import { Button, Card, CardBody, CardFooter, CardHeader } from "@chakra-ui/react";

// /c:/Thư mục mới/my production/học tập - NestJs/nhom-13/app/(page)/gio-hang/page.ts


const CartPage = () => {
    const cartItems = [
        { id: 1, name: "Product 1", price: 100, quantity: 2 },
        { id: 2, name: "Product 2", price: 200, quantity: 1 },
        { id: 3, name: "Product 3", price: 150, quantity: 3 },
    ];

    const calculateTotal = () =>
        cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Giỏ Hàng</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cartItems.map((item) => (
                    <Card key={item.id} className="shadow-lg">
                        <CardHeader className="font-semibold text-lg">{item.name}</CardHeader>
                        <CardBody>
                            <p>Giá: {item.price} VND</p>
                            <p>Số lượng: {item.quantity}</p>
                        </CardBody>
                        <CardFooter>
                            <Button colorScheme="red" size="sm">
                                Xóa
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <div className="mt-6 p-4 border-t">
                <h2 className="text-xl font-semibold">Tổng cộng: {calculateTotal()} VND</h2>
                <Button colorScheme="teal" size="lg" className="mt-4">
                    Thanh Toán
                </Button>
            </div>
        </div>
    );
};

export default CartPage;