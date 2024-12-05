import { ChevronRight, Plus, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
      <img 
        src={product.image} 
        alt={product.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{product.title}</h3>
          <span className="text-xl font-bold text-green-600">R {product.price.toLocaleString()}</span>
        </div>
        <p className="text-gray-600 mb-4">{product.description}</p>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {product.certificates.map((cert, index) => (
              <div key={index} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm">
                <Award className="h-3 w-3 mr-1" />
                {cert}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button 
            onClick={() => addToCart(product)}
            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add to Cart
          </button>
          <button className="text-green-600 font-semibold hover:text-green-700 transition flex items-center">
            Details <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}