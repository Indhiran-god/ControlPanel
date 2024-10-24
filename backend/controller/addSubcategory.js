const Category = require('../models/Category'); // Import the Category model

// Controller to add a subcategory to a specific category
const addSubcategory = async (req, res) => {
    try {
        const { categoryName } = req.body; // Get the category name from the request body
        const { name, image } = req.body; // Get the subcategory name and image

        // Validate input
        if (!categoryName || !name || !image) {
            return res.status(400).json({ success: false, message: 'Category name, subcategory name, and image are required.' });
        }

        // Find the category by name and add the new subcategory
        const updatedCategory = await Category.findOneAndUpdate(
            { name: categoryName },
            { $push: { subCategories: { name, image } } },
            { new: true } // Return the updated document
        );

        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found.' });
        }

        res.json({ success: true, message: 'Subcategory added successfully', data: updatedCategory.subCategories });
    } catch (error) {
        console.error('Error adding subcategory:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports = addSubcategory;
