function ProductForm({
    formData,
    categories,
    editingId,
    onChange,
    onSubmit,
    onCancel
}) {
    return (
        <div className="product-form-card">
            <div className="product-form-header">
                <div>
                    <h3>
                        {editingId
                            ? "Edit Product"
                            : "Add Product"}
                    </h3>

                    <p>
                        {editingId
                            ? "Update product information"
                            : "Enter product information"}
                    </p>
                </div>
            </div>

            <form
                className="product-form"
                onSubmit={onSubmit}
            >
                {/* Product Name */}
                <div className="product-form-group">
                    <label>Product Name</label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        placeholder="Enter product name"
                    />
                </div>

                {/* SKU */}
                <div className="product-form-group">
                    <label>SKU</label>

                    <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={onChange}
                        placeholder="Enter SKU"
                    />
                </div>

                {/* Category */}
                <div className="product-form-group">
                    <label>Category</label>

                    <select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={onChange}
                    >
                        <option value="">
                            -- Select Category --
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category.Id}
                                value={category.Id}
                            >
                                {category.Name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price */}
                <div className="product-form-group">
                    <label>Price</label>

                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={onChange}
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                    />
                </div>

                {/* Stock Quantity */}
                <div className="product-form-group">
                    <label>Stock Quantity</label>

                    <input
                        type="number"
                        name="stockQuantity"
                        value={formData.stockQuantity}
                        onChange={onChange}
                        placeholder="Enter stock quantity"
                        min="0"
                    />
                </div>

                {/* Low Stock Threshold */}
                <div className="product-form-group">
                    <label>
                        Low Stock Threshold
                    </label>

                    <input
                        type="number"
                        name="lowStockThreshold"
                        value={formData.lowStockThreshold}
                        onChange={onChange}
                        placeholder="Enter threshold"
                        min="0"
                    />
                </div>

                {/* Buttons */}
                <div className="product-form-actions">
                    <button
                        type="submit"
                        className="primary-button"
                    >
                        {editingId
                            ? "Update Product"
                            : "Save Product"}
                    </button>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ProductForm;