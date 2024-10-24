const uploadProductPermission = require('../helpers/permission');
const productModel = require('../models/productModel');
const Category = require('../models/Category'); // Import the Category model
const mongoose = require('mongoose'); // Make sure mongoose is imported

async function updateProductController(req, res) {
    try {
        // Check user permission
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Permission denied");
        }

        // Destructure the required fields from req.body
        const { _id, categoryId, subcategoryId, ...resBody } = req.body;

        // Check if category and subcategory IDs are valid
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                message: "Invalid category ID",
                error: true,
                success: false
            });
        }

        if (subcategoryId && !mongoose.Types.ObjectId.isValid(subcategoryId)) {
            return res.status(400).json({
                message: "Invalid subcategory ID",
                error: true,
                success: false
            });
        }

        // Ensure the category exists
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({
                message: "Category not found",
                error: true,
                success: false
            });
        }

        // Update the product with the provided data
        const updateProduct = await productModel.findByIdAndUpdate(
            _id,
            { ...resBody, categoryId, subcategoryId }, // Include categoryId and subcategoryId in update
            { new: true, runValidators: true }
        );

        // Check if the product exists
        if (!updateProduct) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        res.json({
            message: "Product updated successfully",
            data: updateProduct,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = updateProductController;
