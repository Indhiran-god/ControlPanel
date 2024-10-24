import React, { useState } from 'react';
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const AdminProductCard = ({ data, fetchdata }) => {
    const [editProduct, setEditProduct] = useState(false);

    const handleDeleteProduct = async () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(SummaryApi.deleteProduct(data._id).url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error response:', errorData);
                    throw new Error(errorData.message || 'Failed to delete product');
                }

                const responseData = await response.json();
                if (responseData.success) {
                    toast.success(responseData.message);
                    fetchdata(); // Refresh the product list
                } else {
                    toast.error(responseData.message || 'Failed to delete product');
                }
            } catch (error) {
                console.error('Error while deleting product:', error);
                toast.error('An error occurred while deleting the product');
            }
        }
    };

    return (
        <div className='bg-white p-4 rounded'>
            <div className='w-40'>
                <div className='w-32 h-32 flex justify-center items-center'>
                    <img src={data?.productImage[0]} className='mx-auto object-fill h-full' alt={data.productName} />
                </div>
                <h1 className='text-ellipsis line-clamp-2'>{data.productName}</h1>
                <div>
                    <p className='font-semibold'>
                        {displayINRCurrency(data.sellingPrice)}
                    </p>
                    <div className='flex justify-between'>
                        <button className='text-green-500' onClick={() => setEditProduct(!editProduct)}>
                            <MdModeEditOutline />
                        </button>
                        <button className='text-red-500' onClick={handleDeleteProduct}>
                            <MdDelete />
                        </button>
                    </div>
                </div>
            </div>
            {editProduct && (
                <AdminEditProduct 
                    onClose={() => setEditProduct(false)} 
                    productData={data} 
                    fetchdata={fetchdata} 
                />
            )}
        </div>
    );
};

export default AdminProductCard;
