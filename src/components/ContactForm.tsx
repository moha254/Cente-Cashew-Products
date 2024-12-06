import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { Toaster, toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import Receipt from './Receipt';
import { Receipt as ReceiptType } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export default function ContactForm() {
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptType | null>(null);

  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const generateOrderId = () => 'ORD-' + Date.now().toString(36).toUpperCase();

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
      `Thank you!`
    );
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!contactResponse.ok) throw new Error('Failed to save contact information.');

      // Save order information
      const orderResponse = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      if (!orderResponse.ok) throw new Error('Failed to save order.');

      // Send WhatsApp message
      const message = generateWhatsAppMessage(orderId, total);
      const whatsappNumber = '27817745975';
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');

      // Send email notification
      const templateParams = {
        to_email: 'mohamedabukar412@gmail.com',
        from_name: formData.name,
        from_email: formData.email,
        message: `New order ${orderId}\n\nItems:\n${cartItems
          .map(item => `- ${item.title} (Qty: ${item.quantity}) - R ${item.price * item.quantity}`)
          .join('\n')}\n\nTotal: R ${total}`,
      };

      await emailjs.send('service_twwzxus', 'template_gf5pwos', templateParams, 'rkNwubSIlOBGk0Jl7');

      // Show success message and reset state
      toast.success('Order placed successfully!');
      setReceipt({
        orderId,
        date: new Date().toLocaleDateString(),
        items: cartItems,
        total,
        customerInfo: {
          name: formData.name,
          email: formData.email,
        },
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
      clearCart();
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
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
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
            </button>
          </div>
        </form>
      </div>

      {receipt && <Receipt receipt={receipt} onClose={closeReceipt} />}
    </section>
  );
}
