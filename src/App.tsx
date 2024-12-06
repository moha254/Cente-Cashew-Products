import React from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ContactForm from './components/ContactForm';
import { products } from './data/products';
import { Leaf, Award, Truck, Facebook, Instagram, Heart } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

function App() {
  return (
    <CartProvider>
      <div className="bg-light-yellow min-h-screen">
        <Header />

        {/* Hero Section */}
        <section
          className="relative h-screen flex items-center justify-center"
          style={{
            backgroundImage: 'url("/img/background.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative container mx-auto px-4 text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Premium Cashew Products
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              High-quality cashews and cashew-based products. From farm to table, experience
              nature's finest nuts.
            </p>
            <button
              onClick={() =>
                document.getElementById('products')?.scrollIntoView()
              }
              className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition"
            >
              Shop Products
            </button>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Premium Selection
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {Object.values(products).map((category) =>
                category.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <Leaf className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">100% Natural</h3>
                <p className="text-gray-600">Pure, natural cashews with no artificial additives</p>
              </div>
              <div className="flex flex-col items-center">
                <Award className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                <p className="text-gray-600">Carefully selected and processed for the best taste</p>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Quick and secure shipping nationwide</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <ContactForm />

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-xl font-bold mb-4">About Us</h4>
                <p className="text-gray-400">
                  Providing premium quality cashews and cashew products since 2024.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#products" className="text-gray-400 hover:text-white">Products</a></li>
                  <li><a href="#about" className="text-gray-400 hover:text-white">About</a></li>
                  <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-4">Contact</h4>
                <p className="text-gray-400">Email: mohamedabukar412@gmail.com</p>
                <p className="text-gray-400">Phone: (+27) 81 774 5975 </p>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <FaTiktok className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>&copy; 2024 Premium Cashews. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}

export default App;
