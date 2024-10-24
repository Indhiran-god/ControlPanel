const Category = require('../models/Category'); // Adjust the path as necessary

const deleteSubcategory = async (req, res) => {
    try {
        const { subcategoryId } = req.params; // Get subcategory ID from request parameters

        // Ensure IDs are valid
        if (!subcategoryId) {
            return res.status(400).json({ success: false, message: 'Invalid subcategory ID' });
        }

        // Find the category by subcategory ID and remove it
        const updatedCategory = await Category.findOneAndUpdate(
            { 'subCategories._id': subcategoryId },
            { $pull: { subCategories: { _id: subcategoryId } } },
            { new: true } // Return the updated document
        );

        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: 'Subcategory not found' });
        }

        res.json({ success: true, message: 'Subcategory deleted successfully', data: updatedCategory.subCategories });
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports = deleteSubcategory;
