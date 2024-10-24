import React from 'react';
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const AdminSubcategoryCard = ({ data, fetchdata }) => {
    const handleDeleteSubcategory = async () => {
        if (window.confirm("Are you sure you want to delete this subcategory?")) {
            try {
                const subcategoryId = data._id;

                console.log('Deleting subcategory with ID:', subcategoryId);

                if (!subcategoryId) {
                    toast.error('Invalid subcategory ID');
                    return;
                }

                const response = await fetch(SummaryApi.deleteSubcategory(subcategoryId).url, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                const responseData = await response.json();
                if (response.ok && responseData.success) {
                    toast.success(responseData.message);
                    fetchdata();
                } else {
                    toast.error(responseData.message || 'Failed to delete subcategory');
                }
            } catch (error) {
                console.error('Error while deleting subcategory:', error);
                toast.error('An error occurred while deleting the subcategory');
            }
        }
    };

    return (
        <div className='bg-white p-4 rounded shadow h-64 flex flex-col justify-between'> {/* Fixed height */}
            <div className='flex flex-col items-center flex-grow'>
                {data?.image && data.image.length > 0 ? (
                    <img
                        src={data.image[0]}
                        alt={data.name || 'Unnamed Subcategory'}
                        className='w-32 h-32 object-cover rounded mb-2' // Fixed width and height for image
                    />
                ) : (
                    <div className='w-32 h-32 bg-gray-200 rounded mb-2 flex items-center justify-center'>
                        <span>No Image</span>
                    </div>
                )}
                <h1 className='font-bold text-lg text-center flex-grow overflow-hidden text-ellipsis whitespace-nowrap'>
                    {data?.name || 'Unnamed Subcategory'}
                </h1>
            </div>

            <div className='flex justify-between mt-2'>
                <button
                    className='text-red-500'
                    onClick={handleDeleteSubcategory}
                >
                    <MdDelete />
                </button>
            </div>
        </div>
    );
};

export default AdminSubcategoryCard;
