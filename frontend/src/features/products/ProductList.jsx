function ProductList({
    products,
    categories,
    onEdit,
    onDelete
}) {
    // Get category name
    const getCategoryName = (categoryId) => {
        const category = categories.find(
            (item) => item.Id === categoryId
        );

        return category?.Name || categoryId || "-";
    };

    // Format currency
    const formatCurrency = (value) => {
        return `₹${Number(value || 0).toFixed(2)}`;
    };

    return (
        <div className="products-table-card">
            {products.length === 0 ? (
                <div className="products-empty">
                    <p>No products found.</p>
                </div>
            ) : (
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Low Stock Threshold</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => {
                            const isLowStock =
                                Number(product.StockQuantity) <=
                                Number(product.LowStockThreshold);

                            return (
                                <tr key={product.Id}>
                                    {/* ID */}
                                    <td>
                                        {product.Id}
                                    </td>

                                    {/* Name */}
                                    <td>
                                        <span className="product-name">
                                            {product.Name}
                                        </span>
                                    </td>

                                    {/* SKU */}
                                    <td>
                                        <span className="product-sku">
                                            {product.SKU}
                                        </span>
                                    </td>

                                    {/* Category */}
                                    <td>
                                        {getCategoryName(
                                            product.CategoryId
                                        )}
                                    </td>

                                    {/* Price */}
                                    <td>
                                        {formatCurrency(
                                            product.Price
                                        )}
                                    </td>

                                    {/* Stock */}
                                    <td>
                                        {product.StockQuantity}
                                    </td>

                                    {/* Threshold */}
                                    <td>
                                        {product.LowStockThreshold}
                                    </td>

                                    {/* Status */}
                                    <td>
                                        {isLowStock ? (
                                            <span className="stock-low">
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="stock-normal">
                                                In Stock
                                            </span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td>
                                        <div className="product-action-buttons">
                                            <button
                                                className="product-edit-button"
                                                onClick={() =>
                                                    onEdit(product)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="product-delete-button"
                                                onClick={() =>
                                                    onDelete(
                                                        product.Id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ProductList;