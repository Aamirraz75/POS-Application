const productRepository = require("../repositories/productRepository");

async function getProducts(search) {
    return await productRepository.getAllProducts(search);
}

async function getProduct(id) {
    const product = await productRepository.getProductById(id);

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
}

async function createProduct(product) {

    if (!product.name) {
        throw new Error("Product name is required");
    }

    if (!product.sku) {
        throw new Error("SKU is required");
    }

    if (product.price <= 0) {
        throw new Error("Price must be greater than 0");
    }

    if (product.stockQuantity < 0) {
        throw new Error("Stock quantity cannot be negative");
    }

    if (product.lowStockThreshold < 0) {
        throw new Error("Low stock threshold cannot be negative");
    }

    return await productRepository.createProduct(product);
}

async function updateProduct(id, product) {

    await getProduct(id);

    return await productRepository.updateProduct(id, product);
}

async function deleteProduct(id) {

    await getProduct(id);

    return await productRepository.deleteProduct(id);
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};