import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import uploadImage from '../helpers/uploadImage';
import SummaryApi from '../common';

const UploadProduct = ({ onClose, fetchData }) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    categoryId: "",
    subcategoryId: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${SummaryApi.Category.url}`, {
          method: SummaryApi.Category.method
        });
        const result = await response.json();
        if (result.success) {
          setCategories(result.data); // Set fetched categories
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Error fetching categories");
      }
    };
    fetchCategories();
  }, []);

  // Handle category change and fetch subcategories
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;

    // Update the categoryId in the data object and reset subcategoryId
    setData((prev) => ({
      ...prev,
      categoryId: categoryId,
      subcategoryId: "", // Reset subcategory when category changes
    }));

    // Find the selected category from categories
    const selectedCategory = categories.find(cat => cat._id === categoryId);

    // If the category exists and has subcategories, update subCategories state
    if (selectedCategory && selectedCategory.subCategories) {
      setSubCategories(selectedCategory.subCategories);
    } else {
      setSubCategories([]); // Clear subcategories if none exist
    }
  };

  // Handle input change for the form
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle product image upload
  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    const uploadImageCloudinary = await uploadImage(file);

    setData(prev => ({
      ...prev,
      productImage: [...prev.productImage, uploadImageCloudinary.url]
    }));
  };

  // Handle product image deletion
  const handleDeleteProductImage = async (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);

    setData(prev => ({
      ...prev,
      productImage: newProductImage
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a copy of the data to modify before submission
    const productData = { ...data };

    // If subcategoryId is empty, do not include it in the request
    if (!productData.subcategoryId) {
      delete productData.subcategoryId;
    }

    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
      credentials: 'include',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(productData)
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData.message);
      onClose();
      fetchData(); // Call fetchData to refresh data
    }

    if (responseData.error) {
      toast.error(responseData.message);
    }
  };

  return (
    <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
      <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>Upload Product</h2>
          <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
            <CgClose />
          </div>
        </div>

        <form className='grid p-4 gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>
          {/* Product Name */}
          <label htmlFor='productName' className='mt-3'>Product Name:</label>
          <input
            required
            type="text"
            name='productName'
            value={data.productName}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
          />

          {/* Brand Name */}
          <label htmlFor='brandName' className='mt-3'>Brand Name:</label>
          <input
            required
            type="text"
            name='brandName'
            value={data.brandName}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
          />

          {/* Category Dropdown */}
          <label htmlFor='category' className='mt-3'>Category:</label>
          <select
            required
            value={data.categoryId}
            name='categoryId'
            onChange={handleCategoryChange}
            className='p-2 bg-slate-100 border rounded'
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>

          {/* Subcategory Dropdown */}
          { (
            <>
              <label htmlFor='subcategoryId' className='mt-3'>Subcategory:</label>
              <select
                required
                value={data.subcategoryId}
                name='subcategoryId'
                onChange={handleOnChange}
                className='p-2 bg-slate-100 border rounded'
              >
                <option value="">Select Subcategory</option>
                {subCategories.map((subcat) => (
                  <option key={subcat._id} value={subcat._id}>{subcat.name}</option>
                ))}
              </select>
            </>
          )}

          {/* Description */}
          <label htmlFor='description' className='mt-3'>Description:</label>
          <textarea
            required
            name='description'
            value={data.description}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
          ></textarea>

          {/* Price */}
          <label htmlFor='price' className='mt-3'>Price (MRP):</label>
          <input
            required
            type="number"
            name='price'
            value={data.price}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
          />

          {/* Selling Price */}
          <label htmlFor='sellingPrice' className='mt-3'>Selling Price:</label>
          <input
            required
            type="number"
            name='sellingPrice'
            value={data.sellingPrice}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
          />

          {/* Upload Product Image */}
          <label htmlFor='productImage' className='mt-3'>Product Image:</label>
          <input
            type="file"
            onChange={handleUploadProduct}
            className='p-2 bg-slate-100 border rounded'
          />
          <div className='flex flex-wrap gap-2'>
            {data.productImage.map((imgUrl, index) => (
              <div key={index} className='relative'>
                <img
                  src={imgUrl}
                  alt="Product"
                  className='w-20 h-20 object-cover'
                />
                <button
                  type="button"
                  className='absolute top-0 right-0 text-red-500 hover:text-red-600'
                  onClick={() => handleDeleteProductImage(index)}
                >
                  <MdDelete />
                </button>
              </div>
            ))}
          </div>

          <button className='px-3 py-2 bg-green-600 text-white mb-10 hover:bg-green-700 rounded-full'>
            Upload Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadProduct;
