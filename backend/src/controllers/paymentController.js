const paymentService = require("../services/paymentService");

async function processPayment(req, res) {
    try {

        // Secret validation
        const webhookSecret = req.headers["x-webhook-secret"];

        if (webhookSecret !== process.env.PAYMENT_WEBHOOK_SECRET) {
            return res.status(401).json({
                success: false,
                message: "Invalid webhook secret"
            });
        }

        const result = await paymentService.processPayment(req.body);

        res.json({
            success: true,
            message: "Payment processed successfully",
            data: result
        });

    } catch (error) {

        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    processPayment
};