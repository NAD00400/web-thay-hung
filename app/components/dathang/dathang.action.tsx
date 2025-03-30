"use server";

export async function handleOrderSubmit(formData: FormData) {
    const address = formData.get("address") as string;
    const paymentMethod = formData.get("paymentMethod") as string;

    console.log("Address:", address);
    console.log("Payment Method:", paymentMethod);
    
    return { success: true };
}
