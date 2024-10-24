const Category = require('../models/Category'); // Import the Category model

// Controller to get all subcategories from all categories
const getAllSubcategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories
    const allSubcategories = categories.flatMap(category => category.subCategories); // Flatten the subCategories arrays

    return res.status(200).json({ success: true, data: allSubcategories });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Export the controller function
module.exports = getAllSubcategories;
