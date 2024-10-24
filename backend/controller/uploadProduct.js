const uploadProductPermission = require("../helpers/permission");
const productModel = require("../models/productModel");

async function UploadProductController(req, res) {
    try {
        const sessionUserId = req.userId;

        // Check user permission
        if (!uploadProductPermission(sessionUserId)) {
            throw new Error("Permission denied");
        }

        // Ensure that the required fields are present
        const { productName, brandName, categoryId, subcategoryId, productImage, description, price, sellingPrice } = req.body;

        if (!productName || !brandName || !categoryId || !subcategoryId || !productImage || !description || price == null || sellingPrice == null) {
            throw new Error("All fields are required");
        }

        // Create a new product instance
        const uploadProduct = new productModel({
            productName,
            brandName,
            categoryId,
            subcategoryId,
            productImage,
            description,
            price,
            sellingPrice
        });

        // Save the product to the database
        const saveProduct = await uploadProduct.save();

        res.status(201).json({
            message: "Product uploaded successfully",
            error: false,
            success: true,
            data: saveProduct
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = UploadProductController;
