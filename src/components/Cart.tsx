import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {cartItems.map((item) => (
        <div key={item.id} className="py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h4 className="font-medium">{item.title}</h4>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              aria-label="Remove item"
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
      <div className="py-4">
        <button 
          type="button"
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition"
        >
          Request Quote
        </button>
      </div>
    </div>
  );
}