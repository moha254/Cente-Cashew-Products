import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, X, Menu } from 'lucide-react';
import logo from '../../public/img/logo.jpg';

export default function Header() {
  const { cartItems, removeFromCart } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [isCartOpen, setCartOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCheckout = () => setCartOpen(!isCartOpen);

  return (
    <header className="fixed w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <span className="text-xl font-bold text-gray-800">Cente Cashew Products</span>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          aria-label="Toggle mobile menu"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-600 hover:text-blue-600 transition"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isMobileMenuOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row absolute md:relative top-full left-0 right-0 bg-white md:bg-transparent p-4 md:p-0 border-t md:border-0 space-y-4 md:space-y-0 md:items-center md:space-x-8 z-40`}
        >
          <a href="#" className="text-gray-600 hover:text-blue-600 transition">
            Home
          </a>
          <a href="#about" className="text-gray-600 hover:text-blue-600 transition">
            About
          </a>
          <a href="#products" className="text-gray-600 hover:text-blue-600 transition">
            Collection
          </a>
          <a href="#contact" className="text-gray-600 hover:text-blue-600 transition">
            Contact
          </a>
        </div>

        {/* Cart Dropdown */}
        <div className="relative">
          <button
            onClick={handleCheckout}
            className="relative bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition flex items-center"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Checkout
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {isCartOpen && (
            <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg w-64 p-4 z-50">
              <h3 className="font-semibold text-gray-800 mb-3">Cart Items</h3>
              {cartItems.length > 0 ? (
                <ul className="space-y-2">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {item.title} x {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${item.title} from cart`}
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Your cart is empty.</p>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
