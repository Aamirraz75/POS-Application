const orderService = require("../services/orderService");

async function createOrder(req, res) {
    try {
        const order = req.body;

        const result = await orderService.createOrder(order);

        return res.status(201).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("Create order error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getOrders(req, res) {
    try {
        const filters = {
            fromDate: req.query.fromDate || null,
            toDate: req.query.toDate || null,
            paymentStatus: req.query.paymentStatus || null
        };

        const orders = await orderService.getOrders(filters);

        return res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error) {
        console.error("Get orders error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getOrderById(req, res) {
    try {
        const orderId = req.params.orderId;

        const order = await orderService.getOrderById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error("Get order details error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createOrder,
    getOrders,
    getOrderById
};