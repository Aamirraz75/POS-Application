const { sql, getPool } = require("../db/db");

async function getAllProducts(search) {
    const pool = await getPool();

    const request = pool.request();

    request.input("Search", sql.NVarChar(200), search || null);

    const result = await request.query(`
        SELECT
            p.Id,
            p.Name,
            p.SKU,
            p.CategoryId,
            c.Name AS CategoryName,
            p.Price,
            p.StockQuantity,
            p.LowStockThreshold,
            p.CreatedAt,
            p.UpdatedAt
        FROM Products p
        LEFT JOIN Categories c
            ON p.CategoryId = c.Id
        WHERE
            @Search IS NULL
            OR p.Name LIKE '%' + @Search + '%'
            OR p.SKU LIKE '%' + @Search + '%'
        ORDER BY p.Id DESC
    `);

    return result.recordset;
}

async function getProductById(id) {
    const pool = await getPool();

    const request = pool.request();

    request.input("Id", sql.Int, id);

    const result = await request.query(`
        SELECT
            p.Id,
            p.Name,
            p.SKU,
            p.CategoryId,
            c.Name AS CategoryName,
            p.Price,
            p.StockQuantity,
            p.LowStockThreshold,
            p.CreatedAt,
            p.UpdatedAt
        FROM Products p
        LEFT JOIN Categories c
            ON p.CategoryId = c.Id
        WHERE p.Id = @Id
    `);

    return result.recordset[0];
}

async function createProduct(product) {
    const pool = await getPool();

    const request = pool.request();

    request.input("Name", sql.NVarChar(200), product.name);
    request.input("SKU", sql.NVarChar(100), product.sku);
    request.input("CategoryId", sql.Int, product.categoryId || null);
    request.input("Price", sql.Decimal(18, 2), product.price);
    request.input("StockQuantity", sql.Int, product.stockQuantity);
    request.input("LowStockThreshold", sql.Int, product.lowStockThreshold);

    const result = await request.query(`
        INSERT INTO Products
        (
            Name,
            SKU,
            CategoryId,
            Price,
            StockQuantity,
            LowStockThreshold
        )
        OUTPUT INSERTED.Id
        VALUES
        (
            @Name,
            @SKU,
            @CategoryId,
            @Price,
            @StockQuantity,
            @LowStockThreshold
        )
    `);

    return result.recordset[0].Id;
}

async function updateProduct(id, product) {
    const pool = await getPool();

    const request = pool.request();

    request.input("Id", sql.Int, id);
    request.input("Name", sql.NVarChar(200), product.name);
    request.input("SKU", sql.NVarChar(100), product.sku);
    request.input("CategoryId", sql.Int, product.categoryId || null);
    request.input("Price", sql.Decimal(18, 2), product.price);
    request.input("StockQuantity", sql.Int, product.stockQuantity);
    request.input("LowStockThreshold", sql.Int, product.lowStockThreshold);

    const result = await request.query(`
        UPDATE Products
        SET
            Name = @Name,
            SKU = @SKU,
            CategoryId = @CategoryId,
            Price = @Price,
            StockQuantity = @StockQuantity,
            LowStockThreshold = @LowStockThreshold,
            UpdatedAt = GETDATE()
        WHERE Id = @Id
    `);

    return result.rowsAffected[0];
}

async function deleteProduct(id) {
    const pool = await getPool();

    const request = pool.request();

    request.input("Id", sql.Int, id);

    const result = await request.query(`
        DELETE FROM Products
        WHERE Id = @Id
    `);

    return result.rowsAffected[0];
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};