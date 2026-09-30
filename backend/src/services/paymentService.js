const paymentRepository = require("../repositories/paymentRepository");

async function processPayment(data) {

    if (!data.order_id) {
        throw new Error("order_id is required");
    }

    if (!data.status) {
        throw new Error("status is required");
    }

    if (!["success", "failed"].includes(data.status)) {
        throw new Error("Invalid payment status");
    }

    if (data.amount === undefined || data.amount === null) {
        throw new Error("amount is required");
    }

    if (!data.transaction_id) {
        throw new Error("transaction_id is required");
    }

    const payment = {
        orderId: data.order_id,
        status: data.status,
        amount: Number(data.amount),
        transactionId: data.transaction_id
    };

    return await paymentRepository.processPayment(payment);
}

module.exports = {
    processPayment
};