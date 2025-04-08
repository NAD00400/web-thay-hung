import { useState } from "react";

interface QuantityProps {
  itemId: string;
  currentQuantity: number;
  onUpdate: (newQuantity: number) => void;
}

export default function QuantityAdjuster({ itemId, currentQuantity, onUpdate }: QuantityProps) {
  const [quantity, setQuantity] = useState(currentQuantity);

  const handleChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
    onUpdate(newQuantity); // gọi API update ở đây hoặc truyền ra ngoài
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => handleChange(-1)} className="px-2 py-1 bg-gray-200">-</button>
      <span>{quantity}</span>
      <button onClick={() => handleChange(1)} className="px-2 py-1 bg-gray-200">+</button>
    </div>
  );
}
