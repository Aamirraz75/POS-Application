function ProductList({
    products,
    search,
    onSearchChange,
    onAddToCart
}) {
    const filteredProducts = products.filter((product) =>
        product.Name.toLowerCase().includes(search.toLowerCase()) ||
        product.SKU.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="pos-products-section">

            <div className="pos-section-header">
                <h2>Products</h2>
                <span>{filteredProducts.length} products</span>
            </div>

            <input
                type="text"
                placeholder="Search product or SKU..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pos-search"
            />

            <div className="product-grid">

                {filteredProducts.length === 0 ? (
                    <p className="empty-message">
                        No products found.
                    </p>
                ) : (
                    filteredProducts.map((product) => (

                        <div
                            key={product.Id}
                            className="product-card"
                        >

                            <div className="product-card-header">
                                <h3>{product.Name}</h3>

                                {product.StockQuantity <= 0 && (
                                    <span className="out-of-stock">
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            <p className="product-sku">
                                SKU: {product.SKU}
                            </p>

                            <p className="product-price">
                                ₹{Number(product.Price).toFixed(2)}
                            </p>

                            <p className="product-stock">
                                Stock: {product.StockQuantity}
                            </p>

                            <button
                                className="primary-button"
                                onClick={() => onAddToCart(product)}
                                disabled={product.StockQuantity <= 0}
                            >
                                Add to Cart
                            </button>

                        </div>

                    ))
                )}

            </div>

        </div>
    );
}

export default ProductList;