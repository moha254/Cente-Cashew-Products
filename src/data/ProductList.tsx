import React from 'react';
import { products } from './products'; // Import your products data from Product.ts

type ProductItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
  certificates: string[];
};

type Category = {
  display: string;
  items: ProductItem[];
};

const ProductList: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Loop through each category */}
      {Object.keys(products).map((category) => {
        const categoryData = products[category as keyof typeof products] as Category;
        return (
          <div key={category} className="my-8">
            <h2 className="text-2xl font-bold">{categoryData.display}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {/* Loop through each item in the category */}
              {categoryData.items.map((item) => (
                <div key={item.id} className="border p-4 rounded-lg shadow-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    width={item.imageWidth || 80} // Use the provided width, or fallback to 800
                    height={item.imageHeight || 10} // Use the provided height, or fallback to 1000
                    className="w-full h-auto object-cover rounded-lg"
                  />
                  <h3 className="text-xl font-semibold mt-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <p className="text-lg font-bold text-gray-800 mt-2">R {item.price}</p>
                  <div className="mt-2">
                    {item.certificates.map((cert, index) => (
                      <span key={index} className="text-sm text-gray-500">{cert}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
