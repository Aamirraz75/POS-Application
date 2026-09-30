const orderRepository = require("../repositories/orderRepository");

function generateOrderId() {
    const timestamp = Date.now();

    return `ORD-${timestamp}`;
}

async function createOrder(data) {

    if (!data.items || data.items.length === 0) {
        throw new Error("At least one product is required");
    }

    let subtotal = 0;

    const items = data.items.map(item => {

        if (!item.productId) {
            throw new Error("Product ID is required");
        }

        if (!item.quantity || item.quantity <= 0) {
            throw new Error("Quantity must be greater than 0");
        }

        if (!item.unitPrice || item.unitPrice <= 0) {
            throw new Error("Unit price must be greater than 0");
        }

        const lineTotal =
            item.quantity * item.unitPrice;

        subtotal += lineTotal;

        return {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice
        };
    });

    // Discount
    let discount = 0;

    if (data.discountType === "percentage") {

        const discountPercentage =
            Number(data.discountValue || 0);

        discount =
            subtotal * discountPercentage / 100;

    } else if (data.discountType === "fixed") {

        discount =
            Number(data.discountValue || 0);
    }

    // Don't allow discount greater than subtotal
    if (discount > subtotal) {
        discount = subtotal;
    }

    // Amount after discount
    const amountAfterDiscount =
        subtotal - discount;

    // Tax / GST
    const taxPercent =
        Number(data.taxPercent || 0);

    const tax =
        amountAfterDiscount * taxPercent / 100;

    // Final amount
    const grandTotal =
        amountAfterDiscount + tax;

    const orderId = generateOrderId();

    const order = {
        orderId,
        subtotal,
        discount,
        tax,
        grandTotal,
        items
    };

    return await orderRepository.createOrder(order);
}

async function getOrders(filters) {
    return await orderRepository.getOrders(filters);
}


async function getOrderById(orderId) {

    const order =
        await orderRepository.getOrderById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    return order;
}

module.exports = {
    createOrder,
    getOrders,
    getOrderById
};