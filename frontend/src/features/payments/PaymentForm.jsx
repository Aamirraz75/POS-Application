function PaymentForm({
    orders,
    selectedOrderId,
    onOrderChange,
    transactionId,
    onPay,
    loading
}) {
    const selectedOrder = orders.find(
        (order) => order.OrderId === selectedOrderId
    );

    return (
        <div className="payment-form">
            <div className="form-group">
                <label>Select Pending Order</label>

                <select
                    value={selectedOrderId}
                    onChange={(e) => onOrderChange(e.target.value)}
                    disabled={loading}
                >
                    <option value="">-- Select Order --</option>

                    {orders.map((order) => (
                        <option
                            key={order.OrderId}
                            value={order.OrderId}
                        >
                            {order.OrderId} - ₹
                            {Number(order.GrandTotal).toFixed(2)}
                        </option>
                    ))}
                </select>
            </div>

            {selectedOrder && (
                <div className="payment-details">
                    <div>
                        <span>Order ID</span>
                        <strong>{selectedOrder.OrderId}</strong>
                    </div>

                    <div>
                        <span>Amount</span>
                        <strong>
                            ₹{Number(selectedOrder.GrandTotal).toFixed(2)}
                        </strong>
                    </div>

                    <div>
                        <span>Transaction ID</span>
                        <strong>{transactionId}</strong>
                    </div>
                </div>
            )}

            {orders.length === 0 && (
                <p className="empty-message">
                    No pending orders available.
                </p>
            )}

            {selectedOrder && (
                <div className="payment-actions">
                    <button
                        className="primary-button"
                        onClick={() => onPay("success")}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Pay Success"}
                    </button>

                    <button
                        className="secondary-button"
                        onClick={() => onPay("failed")}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Pay Failed"}
                    </button>
                </div>
            )}
        </div>
    );
}

export default PaymentForm;