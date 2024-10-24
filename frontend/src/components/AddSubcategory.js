// components/AddSubcategory.js
import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import uploadImage from '../helpers/uploadImage'; // Assuming you have this helper
import SummaryApi from '../common';

const AddSubcategory = ({ onClose, fetchCategories }) => {
    const [data, setData] = useState({
        name: "",
        categoryName: "", // Change categoryId to categoryName
        subcategoryImages: [] // Store multiple uploaded image URLs
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch categories when component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await fetch(SummaryApi.Category.url, {
                    method: SummaryApi.Category.method
                });
                const result = await response.json();
                if (result.success) {
                    setCategories(result.data);
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                toast.error("Error fetching categories");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Handle form field changes
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle image upload
    const handleUploadImage = async (e) => {
        const files = Array.from(e.target.files);
        try {
            const imageUrls = await Promise.all(files.map(file => uploadImage(file)));
            setData((prev) => ({ ...prev, subcategoryImages: imageUrls.map(img => img.url) }));
        } catch (error) {
            toast.error("Error uploading images");
        }
    };

    // Handle image deletion
    const handleDeleteImage = (index) => {
        setData((prev) => {
            const newImages = [...prev.subcategoryImages];
            newImages.splice(index, 1);
            return { ...prev, subcategoryImages: newImages };
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!data.name || !data.categoryName || data.subcategoryImages.length === 0) {
            toast.error("Please fill all required fields and upload at least one image");
            return;
        }

        const payload = {
            name: data.name,
            categoryName: data.categoryName, // Use categoryName instead of categoryId
            image: data.subcategoryImages[0], // Send only the first image as a string
        };

        try {
            // Make the API call using categoryName instead of categoryId
            const response = await fetch(SummaryApi.addSubcategory.url.replace(':categoryName', data.categoryName), {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();
            if (responseData.success) {
                toast.success(responseData.message);
                onClose(); // Close modal on success
                fetchCategories(); // Refresh the category list
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            toast.error("Failed to add subcategory");
        }
    };

    return (
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 flex justify-center items-center'>
            <div className='bg-white p-4 rounded w-full max-w-md overflow-hidden'>
                <div className='flex justify-between items-center pb-3'>
                    <h2 className='font-bold text-lg'>Add Subcategory</h2>
                    <div className='text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                        <CgClose />
                    </div>
                </div>

                <form className='grid p-4 gap-2' onSubmit={handleSubmit}>
                    <label htmlFor='name'>Subcategory Name:</label>
                    <input
                        required
                        type="text"
                        name='name'
                        value={data.name}
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    />

                    <label htmlFor='categoryName'>Category:</label>
                    <select
                        required
                        value={data.categoryName}
                        name='categoryName'
                        onChange={handleOnChange}
                        className='p-2 bg-slate-100 border rounded'
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category.name}>{category.name}</option> // Use category name as value
                        ))}
                    </select>

                    <label htmlFor='subcategoryImages'>Subcategory Images:</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleUploadImage}
                        className='p-2 bg-slate-100 border rounded'
                    />

                    <div className='flex flex-wrap gap-2'>
                        {data.subcategoryImages.map((imgUrl, index) => (
                            <div key={index} className='relative'>
                                <img src={imgUrl} alt="Subcategory" className='w-20 h-20 object-cover' />
                                <button
                                    type="button"
                                    className='absolute top-0 right-0 text-red-500 hover:text-red-600'
                                    onClick={() => handleDeleteImage(index)}
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        ))}
                    </div>

                    {loading && <p>Loading categories...</p>}

                    <button className='px-3 py-2 bg-green-600 text-white mb-10 hover:bg-green-700 rounded-full'>
                        Add Subcategory
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddSubcategory;
