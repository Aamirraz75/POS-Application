const { sql, getPool } = require("../db/db");

async function createOrder(order) {
    const pool = await getPool();

    const request = pool.request();

    request.input("OrderId", sql.VarChar(30), order.orderId);
    request.input("Subtotal", sql.Decimal(18, 2), order.subtotal);
    request.input("Discount", sql.Decimal(18, 2), order.discount);
    request.input("Tax", sql.Decimal(18, 2), order.tax);
    request.input("GrandTotal", sql.Decimal(18, 2), order.grandTotal);

    request.input(
        "Items",
        sql.NVarChar(sql.MAX),
        JSON.stringify(order.items)
    );

    const result = await request.execute("sp_CreateOrder");

    return result.recordset[0];
}

async function getOrders(filters) {
    const pool = await getPool();

    const request = pool.request();

    request.input(
        "FromDate",
        sql.Date,
        filters.fromDate || null
    );

    request.input(
        "ToDate",
        sql.Date,
        filters.toDate || null
    );

    request.input(
        "PaymentStatus",
        sql.VarChar(20),
        filters.paymentStatus || null
    );

    const result = await request.query(`
        SELECT
            Id,
            OrderId,
            Subtotal,
            Discount,
            Tax,
            GrandTotal,
            PaymentStatus,
            TransactionId,
            CreatedAt
        FROM Orders
        WHERE
            (@FromDate IS NULL OR CAST(CreatedAt AS DATE) >= @FromDate)
            AND
            (@ToDate IS NULL OR CAST(CreatedAt AS DATE) <= @ToDate)
            AND
            (@PaymentStatus IS NULL OR PaymentStatus = @PaymentStatus)
        ORDER BY CreatedAt DESC
    `);

    return result.recordset;
}


async function getOrderById(orderId) {
    const pool = await getPool();

    const request = pool.request();

    request.input(
        "OrderId",
        sql.VarChar(30),
        orderId
    );

    const orderResult = await request.query(`
        SELECT
            Id,
            OrderId,
            Subtotal,
            Discount,
            Tax,
            GrandTotal,
            PaymentStatus,
            TransactionId,
            CreatedAt
        FROM Orders
        WHERE OrderId = @OrderId
    `);

    if (orderResult.recordset.length === 0) {
        return null;
    }

    const order = orderResult.recordset[0];

    request.input(
        "InternalOrderId",
        sql.Int,
        order.Id
    );

    const itemsResult = await request.query(`
        SELECT
            oi.Id,
            oi.ProductId,
            p.Name AS ProductName,
            p.SKU,
            oi.Quantity,
            oi.UnitPrice,
            oi.LineTotal
        FROM OrderItems oi
        INNER JOIN Products p
            ON oi.ProductId = p.Id
        WHERE oi.OrderId = @InternalOrderId
        ORDER BY oi.Id
    `);

    order.Items = itemsResult.recordset;

    return order;
}

module.exports = {
    createOrder,
    getOrders,
    getOrderById
};