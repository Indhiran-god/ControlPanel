const productModel = require("../models/productModel");

const getProductDetails = async (req, res) => {
    try {
        const { productId } = req.params; // Use params instead of body for fetching the product ID

        // Check if productId is provided
        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required",
                error: true,
                success: false
            });
        }

        // Fetch product details
        const product = await productModel.findById(productId);

        // Check if product exists
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        res.json({
            data: product,
            message: "Product retrieved successfully",
            success: true,
            error: false
        });

    } catch (err) {
        res.status(500).json({
            message: err?.message || "An error occurred while fetching product details",
            error: true,
            success: false
        });
    }
};

module.exports = getProductDetails;
