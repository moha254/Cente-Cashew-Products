import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { Toaster, toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import Receipt from './Receipt';
import { Receipt as ReceiptType } from '../types';

const API_URL = 'http://localhost:5000/api';

export default function ContactForm() {
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptType | null>(null);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const generateOrderId = () => {
    return 'ORD-' + Date.now().toString(36).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderId = generateOrderId();
      const total = calculateTotal();

      // Save contact information
      const contactResponse = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      if (!contactResponse.ok) {
        throw new Error('Failed to save contact information');
      }

      // Save order information
      const orderResponse = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          customerName: formData.name,
          email: formData.email,
          phone: formData.phone,
          items: cartItems.map(item => ({
            name: item.title,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: total,
          status: 'pending',
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to save order');
      }

      const message = generateWhatsAppMessage(orderId, total);
      const whatsappNumber = '27817745975';
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');

      const newReceipt: ReceiptType = {
        orderId,
        date: new Date().toLocaleDateString(),
        items: cartItems,
        total,
        customerInfo: {
          name: formData.name,
          email: formData.email
        }
      };

      const templateParams = {
        to_email: 'mohamedabukar412@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        message: `New order ${orderId}\n\nItems:\n${cartItems
          .map(item => `- ${item.title} (Qty: ${item.quantity}) - R ${item.price * item.quantity}`)
          .join('\n')}\n\nTotal: R ${total}`,
      };

      await emailjs.send(
        'service_twwzxus',
        'template_gf5pwos',
        templateParams,
        'rkNwubSIlOBGk0Jl7'
      );

      toast.success('Order placed successfully!');
      setReceipt(newReceipt);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const closeReceipt = () => {
    setReceipt(null);
    clearCart();
  };

  const generateWhatsAppMessage = (orderId: string, total: number) => {
    const itemsList = cartItems
      .map(item => `- ${item.title} (Qty: ${item.quantity}) - R ${(item.price * item.quantity).toLocaleString()}`)
      .join('\n');

    return encodeURIComponent(
      `*New Order: ${orderId}*\n\n` +
      `*Customer Details:*\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n\n` +
      `*Order Items:*\n${itemsList}\n\n` +
      `*Total: R ${total.toLocaleString()}*\n\n` +
      `${formData.message ? `*Special Instructions:*\n${formData.message}\n\n` : ''}` +
      `Thank you for your order!`
    );
  };

  return (
    <section className="py-20 bg-gray-50" id="contact">
      <div className="container mx-auto px-4 max-w-2xl">
        <Toaster position="top-center" />
        <h2 className="text-4xl font-bold text-center mb-8">Complete Your Order</h2>
        
        {cartItems.length > 0 && (
          <div className="mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <ShoppingBag className="h-5 w-5" />
              <h3 className="font-semibold">Your Cart</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {cartItems.map(item => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.title} (Qty: {item.quantity})</span>
                  <span>R {(item.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="flex justify-between font-bold text-green-800">
                <span>Total:</span>
                <span>R {calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2" aria-label="Full Name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              disabled={isSubmitting}
              placeholder="Any special requirements or notes for your order..."
            />
          </div>
          
          <div className="flex">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || cartItems.length === 0}
            >
              <span>{isSubmitting ? 'Processing...' : 'Place Order via WhatsApp'}</span>
              <svg className="h-5 w-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </button>
          </div>
        </form>
      </div>

      {receipt && <Receipt receipt={receipt} onClose={closeReceipt} />}
    </section>
  );
}