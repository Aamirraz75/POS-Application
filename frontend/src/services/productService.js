import api from "./api";

// Get all products
export const getProducts = () => {
    return api.get("/products");
};

// Get product by ID
export const getProductById = (id) => {
    return api.get(`/products/${id}`);
};

// Get all categories
export const getCategories = () => {
    return api.get("/categories");
};

// Create product
export const createProduct = (product) => {
    return api.post("/products", product);
};

// Update product
export const updateProduct = (id, product) => {
    return api.put(`/products/${id}`, product);
};

// Delete product
export const deleteProduct = (id) => {
    return api.delete(`/products/${id}`);
};