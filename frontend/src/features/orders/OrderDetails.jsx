function OrderDetails({
    order,
    loading,
    onClose
}) {
    const formatCurrency = (value) => {
        return `₹${Number(value || 0).toFixed(2)}`;
    };

    const formatDate = (value) => {
        return new Date(value).toLocaleString("en-IN");
    };

    return (
        <div className="details-card">

            <div className="details-header">

                <div>
                    <h2>Order Details</h2>

                    <p>
                        Order ID:{" "}
                        <strong>{order.OrderId}</strong>
                    </p>
                </div>

                <button
                    className="close-button"
                    onClick={onClose}
                >
                    ✕
                </button>

            </div>

            {loading ? (
                <p>Loading order details...</p>
            ) : (
                <>

                    {/* Order Summary */}

                    <div className="order-summary">

                        <div>
                            <span>Status</span>

                            <strong
                                className={`status ${order.PaymentStatus?.toLowerCase()}`}
                            >
                                {order.PaymentStatus}
                            </strong>
                        </div>

                        <div>
                            <span>Transaction ID</span>

                            <strong>
                                {order.TransactionId || "-"}
                            </strong>
                        </div>

                        <div>
                            <span>Created At</span>

                            <strong>
                                {formatDate(order.CreatedAt)}
                            </strong>
                        </div>

                    </div>


                    {/* Items */}

                    <h3>Order Items</h3>

                    {!order.Items ||
                    order.Items.length === 0 ? (
                        <p>No items found for this order.</p>
                    ) : (
                        <table>

                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Line Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {order.Items.map((item) => (
                                    <tr key={item.Id}>

                                        <td>
                                            {item.ProductName}
                                        </td>

                                        <td>
                                            {item.SKU}
                                        </td>

                                        <td>
                                            {item.Quantity}
                                        </td>

                                        <td>
                                            {formatCurrency(
                                                item.UnitPrice
                                            )}
                                        </td>

                                        <td>
                                            <strong>
                                                {formatCurrency(
                                                    item.LineTotal
                                                )}
                                            </strong>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    )}


                    {/* Totals */}

                    <div className="order-totals">

                        <div>
                            <span>Subtotal</span>

                            <strong>
                                {formatCurrency(order.Subtotal)}
                            </strong>
                        </div>

                        <div>
                            <span>Discount</span>

                            <strong>
                                - {formatCurrency(order.Discount)}
                            </strong>
                        </div>

                        <div>
                            <span>GST</span>

                            <strong>
                                {formatCurrency(order.Tax)}
                            </strong>
                        </div>

                        <div className="grand-total">

                            <span>Grand Total</span>

                            <strong>
                                {formatCurrency(order.GrandTotal)}
                            </strong>

                        </div>

                    </div>

                </>
            )}

        </div>
    );
}

export default OrderDetails;