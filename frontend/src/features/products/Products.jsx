import { useEffect, useState } from "react";

import {
    getProducts,
    getCategories,
    createProduct,
    updateProduct,
    deleteProduct
} from "../../services/productService";

import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import "./Products.css";

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        categoryId: "",
        price: "",
        stockQuantity: "",
        lowStockThreshold: ""
    });

    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // =========================
    // GET PRODUCTS
    // =========================

    const fetchProducts = async () => {
        try {
            setError("");

            const response = await getProducts();

            const data = Array.isArray(
                response.data?.data
            )
                ? response.data.data
                : [];

            setProducts(data);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load products."
            );
        }
    };

    // =========================
    // GET CATEGORIES
    // =========================

    const fetchCategories = async () => {
        try {
            const response = await getCategories();

            const data = Array.isArray(
                response.data?.data
            )
                ? response.data.data
                : [];

            setCategories(data);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load categories."
            );
        }
    };

    // =========================
    // INPUT CHANGE
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {
        setFormData({
            name: "",
            sku: "",
            categoryId: "",
            price: "",
            stockQuantity: "",
            lowStockThreshold: ""
        });

        setEditingId(null);
        setShowForm(false);
    };

    // =========================
    // ADD PRODUCT
    // =========================

    const handleAdd = () => {
        setMessage("");
        setError("");

        setFormData({
            name: "",
            sku: "",
            categoryId: "",
            price: "",
            stockQuantity: "",
            lowStockThreshold: ""
        });

        setEditingId(null);
        setShowForm(true);
    };

    // =========================
    // EDIT PRODUCT
    // =========================

    const handleEdit = (product) => {
        setMessage("");
        setError("");

        setFormData({
            name: product.Name || "",
            sku: product.SKU || "",
            categoryId: product.CategoryId || "",
            price: product.Price ?? "",
            stockQuantity:
                product.StockQuantity ?? "",
            lowStockThreshold:
                product.LowStockThreshold ?? ""
        });

        setEditingId(product.Id);
        setShowForm(true);

        // Scroll to form
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =========================
    // VALIDATION
    // =========================

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError("Product name is required.");
            return false;
        }

        if (!formData.sku.trim()) {
            setError("SKU is required.");
            return false;
        }

        if (!formData.categoryId) {
            setError("Please select a category.");
            return false;
        }

        if (
            formData.price === "" ||
            Number(formData.price) < 0
        ) {
            setError("Please enter a valid price.");
            return false;
        }

        if (
            formData.stockQuantity === "" ||
            Number(formData.stockQuantity) < 0
        ) {
            setError(
                "Please enter a valid stock quantity."
            );
            return false;
        }

        if (
            formData.lowStockThreshold === "" ||
            Number(formData.lowStockThreshold) < 0
        ) {
            setError(
                "Please enter a valid low stock threshold."
            );
            return false;
        }

        return true;
    };

    // =========================
    // SAVE PRODUCT
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        // Validate
        if (!validateForm()) {
            return;
        }

        // Prepare payload
        const payload = {
            name: formData.name.trim(),
            sku: formData.sku.trim(),
            categoryId: Number(
                formData.categoryId
            ),
            price: Number(formData.price),
            stockQuantity: Number(
                formData.stockQuantity
            ),
            lowStockThreshold: Number(
                formData.lowStockThreshold
            )
        };

        try {
            if (editingId) {
                // UPDATE
                await updateProduct(
                    editingId,
                    payload
                );

                setMessage(
                    "Product updated successfully."
                );

            } else {
                // CREATE
                await createProduct(payload);

                setMessage(
                    "Product added successfully."
                );
            }

            resetForm();

            await fetchProducts();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to save product."
            );
        }
    };

    // =========================
    // DELETE PRODUCT
    // =========================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        setMessage("");
        setError("");

        try {
            await deleteProduct(id);

            setMessage(
                "Product deleted successfully."
            );

            await fetchProducts();

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete product."
            );
        }
    };

    // =========================
    // SEARCH
    // =========================

    const filteredProducts = products.filter(
        (product) => {
            const searchText =
                search.toLowerCase().trim();

            if (!searchText) {
                return true;
            }

            return (
                product.Name
                    ?.toLowerCase()
                    .includes(searchText) ||
                product.SKU
                    ?.toLowerCase()
                    .includes(searchText)
            );
        }
    );

    // =========================
    // UI
    // =========================

    return (
        <div className="products-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="products-header">
                <div>
                    <h1>Product Management</h1>

                    <p>
                        Manage products, pricing and
                        inventory
                    </p>
                </div>

                <div className="products-actions">

                    <input
                        className="products-search"
                        type="text"
                        placeholder="Search by Name or SKU"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <button
                        className="primary-button"
                        onClick={handleAdd}
                    >
                        + Add Product
                    </button>

                </div>
            </div>

            {/* =========================
                MESSAGES
            ========================= */}

            {message && (
                <div className="product-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="product-error">
                    {error}
                </div>
            )}

            {/* =========================
                FORM
            ========================= */}

            {showForm && (
                <ProductForm
                    formData={formData}
                    categories={categories}
                    editingId={editingId}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={resetForm}
                />
            )}

            {/* =========================
                PRODUCT LIST
            ========================= */}

            <ProductList
                products={filteredProducts}
                categories={categories}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

        </div>
    );
}

export default Products;