import { useEffect, useState } from "react";
import PaymentForm from "./PaymentForm";
import {
    getPendingOrders,
    processPayment as processPaymentApi
} from "../../services/paymentService";

import "./Payment.css";

function Payment() {
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadPendingOrders = async () => {
        try {
            setError("");

            const response = await getPendingOrders();

            setOrders(response.data?.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load pending orders."
            );
        }
    };

    useEffect(() => {
        loadPendingOrders();
    }, []);

    const handleOrderChange = (orderId) => {
        setSelectedOrderId(orderId);
        setMessage("");
        setError("");

        if (orderId) {
            const newTransactionId =
                `TXN-${Date.now()}`;

            setTransactionId(newTransactionId);
        } else {
            setTransactionId("");
        }
    };

    const handlePay = async (status) => {
        try {
            setLoading(true);
            setMessage("");
            setError("");

            const selectedOrder = orders.find(
                (order) => order.OrderId === selectedOrderId
            );

            if (!selectedOrder) {
                setError("Please select an order.");
                return;
            }

            const response = await processPaymentApi(
                selectedOrder.OrderId,
                status,
                selectedOrder.GrandTotal,
                transactionId
            );

            const paymentStatus =
                response.data?.data?.PaymentStatus;

            if (paymentStatus === "Paid") {
                setMessage(
                    `Payment successful for ${selectedOrder.OrderId}.`
                );
            } else if (paymentStatus === "Failed") {
                setMessage(
                    `Payment failed for ${selectedOrder.OrderId}.`
                );
            } else {
                setMessage(
                    response.data?.message ||
                    "Payment processed."
                );
            }

            setSelectedOrderId("");
            setTransactionId("");

            await loadPendingOrders();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Payment processing failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">

            <div className="page-header">
                <div>
                    <h1>Payment</h1>
                    <p>
                        Select a pending order and process payment.
                    </p>
                </div>
            </div>

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="payment-card">
                <PaymentForm
                    orders={orders}
                    selectedOrderId={selectedOrderId}
                    onOrderChange={handleOrderChange}
                    transactionId={transactionId}
                    onPay={handlePay}
                    loading={loading}
                />
            </div>

        </div>
    );
}

export default Payment;