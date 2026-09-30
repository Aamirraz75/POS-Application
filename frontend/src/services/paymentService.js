import api from "./api";

export const getPendingOrders = () => {
    return api.get("/orders", {
        params: {
            paymentStatus: "Pending"
        }
    });
};

export const processPayment = (
    orderId,
    status,
    amount,
    transactionId
) => {
    return api.post(
        "/webhooks/payment",
        {
            order_id: orderId,
            status: status,
            amount: Number(amount),
            transaction_id: transactionId
        },
        {
            headers: {
                "x-webhook-secret": "my-pos-secret"
            }
        }
    );
};