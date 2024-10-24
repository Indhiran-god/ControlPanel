const Product = require('../models/productModel');

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        // Find the product and remove it
        const deletedProduct = await Product.findByIdAndDelete(productId);

        // Check if the product was found and deleted
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product deleted successfully', data: deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = deleteProduct;
