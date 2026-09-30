const { sql, getPool } = require("../db/db");

async function processPayment(payment) {
    const pool = await getPool();

    const request = pool.request();

    request.input("OrderId", sql.VarChar(30), payment.orderId);
    request.input("Status", sql.VarChar(20), payment.status);
    request.input("Amount", sql.Decimal(18, 2), payment.amount);
    request.input("TransactionId", sql.VarChar(100), payment.transactionId);

    const result = await request.execute("sp_ProcessPayment");

    return result.recordset[0];
}

module.exports = {
    processPayment
};