const { sql, getPool } = require("../db/db");

async function getDailyReport(fromDate, toDate) {

    const pool = await getPool();

    const request = pool.request();

    request.input("FromDate", sql.Date, fromDate || null);
    request.input("ToDate", sql.Date, toDate || null);

    const result = await request.query(`
        SELECT
            CAST(CreatedAt AS DATE) AS ReportDate,
            COUNT(*) AS TotalOrders,
            SUM(GrandTotal) AS TotalRevenue,
            SUM(Discount) AS TotalDiscount
        FROM Orders
        WHERE
            PaymentStatus = 'Paid'
            AND (@FromDate IS NULL OR CAST(CreatedAt AS DATE) >= @FromDate)
            AND (@ToDate IS NULL OR CAST(CreatedAt AS DATE) <= @ToDate)
        GROUP BY CAST(CreatedAt AS DATE)
        ORDER BY ReportDate DESC
    `);

    return result.recordset;
}

async function getOrdersForExport(fromDate, toDate, paymentStatus) {

    const pool = await getPool();

    const request = pool.request();

    request.input("FromDate", sql.Date, fromDate || null);
    request.input("ToDate", sql.Date, toDate || null);
    request.input("PaymentStatus", sql.VarChar(20), paymentStatus || null);

    const result = await request.query(`
        SELECT
            o.OrderId,
            o.Subtotal,
            o.Discount,
            o.Tax,
            o.GrandTotal,
            o.PaymentStatus,
            o.TransactionId,
            o.CreatedAt,
            p.Name AS ProductName,
            p.SKU,
            oi.Quantity,
            oi.UnitPrice,
            oi.LineTotal
        FROM Orders o
        INNER JOIN OrderItems oi
            ON o.Id = oi.OrderId
        INNER JOIN Products p
            ON oi.ProductId = p.Id
        WHERE
            (@FromDate IS NULL OR CAST(o.CreatedAt AS DATE) >= @FromDate)
            AND
            (@ToDate IS NULL OR CAST(o.CreatedAt AS DATE) <= @ToDate)
            AND
            (@PaymentStatus IS NULL OR o.PaymentStatus = @PaymentStatus)
        ORDER BY o.CreatedAt DESC, oi.Id
    `);

    return result.recordset;
}

module.exports = {
    getDailyReport,
    getOrdersForExport
};