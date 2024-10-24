import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SummaryApi from '../common'; // Ensure the correct path to SummaryApi
import { toast } from 'react-toastify';

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(SummaryApi.getProduct(productId).url); // Fetch product details
      const data = await response.json();
      if (response.ok && data.success) {
        setProduct(data.data); // Assuming your API returns product details in this format
      } else {
        throw new Error(data.message || 'Failed to fetch product');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product:', err);
      toast.error(err.message); // Show error message to user
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // Handle loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='p-4'>
      {product ? (
        <div>
          <h2 className='font-bold text-xl'>{product.productName}</h2>
          <p>Price: {product.price}</p>
          <p>Selling Price: {product.sellingPrice}</p>
          {product.productImage.length > 0 && (
            <img
              src={product.productImage[0]} // Display the first image
              alt={product.productName}
              className="w-full h-64 object-cover mt-2"
            />
          )}
          <p>{product.description}</p> {/* Product description if available */}
        </div>
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
};

export default ProductPage;
