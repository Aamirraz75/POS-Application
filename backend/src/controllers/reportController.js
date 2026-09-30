const reportService = require("../services/reportService");

async function getDailyReport(req, res) {

    try {

        const filters = {
            fromDate: req.query.fromDate,
            toDate: req.query.toDate
        };

        const report = await reportService.getDailyReport(filters);

        res.json({
            success: true,
            data: report
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function exportOrders(req, res) {

    try {

        const filters = {
            fromDate: req.query.fromDate,
            toDate: req.query.toDate,
            paymentStatus: req.query.paymentStatus
        };

        const orders = await reportService.getOrdersForExport(filters);

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found"
            });
        }

        const headers = [
            "OrderId",
            "Subtotal",
            "Discount",
            "Tax",
            "GrandTotal",
            "PaymentStatus",
            "TransactionId",
            "CreatedAt",
            "ProductName",
            "SKU",
            "Quantity",
            "UnitPrice",
            "LineTotal"
        ];

        const csvRows = [];

        csvRows.push(headers.join(","));

        for (const order of orders) {

            const row = headers.map(header => {

                let value = order[header];

                if (value === null || value === undefined) {
                    value = "";
                }

                value = String(value).replace(/"/g, '""');

                return `"${value}"`;
            });

            csvRows.push(row.join(","));
        }

        const csv = csvRows.join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=orders-report.csv"
        );

        res.send(csv);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    getDailyReport,
    exportOrders
};