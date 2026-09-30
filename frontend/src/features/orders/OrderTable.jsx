function OrderTable({
    orders,
    loading,
    onViewDetails
}) {
    const formatCurrency = (value) => {
        return `₹${Number(value || 0).toFixed(2)}`;
    };

    const formatDate = (value) => {
        return new Date(value).toLocaleString("en-IN");
    };

    if (loading) {
        return <p>Loading orders...</p>;
    }

    if (orders.length === 0) {
        return <p>No orders found.</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Order ID</th>
                    <th>Subtotal</th>
                    <th>Discount</th>
                    <th>Tax</th>
                    <th>Grand Total</th>
                    <th>Status</th>
                    <th>Transaction ID</th>
                    <th>Created At</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                {orders.map((order) => (
                    <tr key={order.Id}>

                        <td>{order.Id}</td>

                        <td>
                            <strong>{order.OrderId}</strong>
                        </td>

                        <td>
                            {formatCurrency(order.Subtotal)}
                        </td>

                        <td>
                            {formatCurrency(order.Discount)}
                        </td>

                        <td>
                            {formatCurrency(order.Tax)}
                        </td>

                        <td>
                            <strong>
                                {formatCurrency(order.GrandTotal)}
                            </strong>
                        </td>

                        <td>
                            <span
                                className={`status ${order.PaymentStatus?.toLowerCase()}`}
                            >
                                {order.PaymentStatus}
                            </span>
                        </td>

                        <td>
                            {order.TransactionId || "-"}
                        </td>

                        <td>
                            {formatDate(order.CreatedAt)}
                        </td>

                        <td>
                            <button
                                className="primary-button"
                                onClick={() =>
                                    onViewDetails(order.OrderId)
                                }
                            >
                                View Details
                            </button>
                        </td>

                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default OrderTable;