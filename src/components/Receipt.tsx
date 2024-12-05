import { Receipt as ReceiptType } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Printer } from 'lucide-react';

interface ReceiptProps {
  receipt: ReceiptType;
  onClose: () => void;
}

export default function Receipt({ receipt, onClose }: ReceiptProps) {
  const handlePrint = async () => {
    const receiptElement = document.getElementById('receipt');
    if (receiptElement) {
      const canvas = await html2canvas(receiptElement);
      const pdf = new jsPDF();
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
      pdf.save(`receipt-${receipt.orderId}.pdf`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full mx-4">
        <div id="receipt" className="bg-white p-6">
          <div className="text-center mb-6">
          
            <h2 className="text-2xl font-bold">7 Days Menswear</h2>
            <p className="text-gray-600">Order Receipt</p>
          </div>

          <div className="mb-6">
            <p><strong>Order ID:</strong> {receipt.orderId}</p>
            <p><strong>Date:</strong> {receipt.date}</p>
            <p><strong>Customer:</strong> {receipt.customerInfo.name}</p>
            <p><strong>Email:</strong> {receipt.customerInfo.email}</p>
          </div>

          <table className="w-full mb-6">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Item</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.title}</td>
                  <td className="text-right py-2">{item.quantity}</td>
                  <td className="text-right py-2">KES {item.price.toLocaleString()}</td>
                  <td className="text-right py-2">KES {(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={3} className="text-right py-2">Total:</td>
                <td className="text-right py-2">KES {receipt.total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div className="text-center text-sm text-gray-600">
            <p>Thank you for shopping with 7 Days Menswear!</p>
            <p>All items come with our quality guarantee.</p>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
          >
            <Printer className="h-4 w-4 mr-2" />
            Save PDF
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}