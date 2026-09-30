const productService = require("../services/productService");

async function getProducts(req, res) {
    try {

        const search = req.query.search;

        const products = await productService.getProducts(search);

        res.json({
            success: true,
            data: products
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getProduct(req, res) {
    try {

        const id = Number(req.params.id);

        const product = await productService.getProduct(id);

        res.json({
            success: true,
            data: product
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });
    }
}

async function createProduct(req, res) {
    try {

        const product = req.body;

        const id = await productService.createProduct(product);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            id: id
        });

    } catch (error) {

        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function updateProduct(req, res) {
    try {

        const id = Number(req.params.id);

        await productService.updateProduct(id, req.body);

        res.json({
            success: true,
            message: "Product updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function deleteProduct(req, res) {
    try {

        const id = Number(req.params.id);

        await productService.deleteProduct(id);

        res.json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};