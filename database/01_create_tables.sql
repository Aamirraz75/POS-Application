-- =========================================================
-- 01_create_tables.sql
-- POS Billing & Inventory Management System
-- =========================================================

IF DB_ID('POSDB') IS NULL
    CREATE DATABASE POSDB;
GO

USE POSDB;
GO


-- =========================================================
-- DROP EXISTING TABLES
-- Drop child tables first because of foreign keys
-- =========================================================

IF OBJECT_ID('dbo.WebhookLogs', 'U') IS NOT NULL
    DROP TABLE dbo.WebhookLogs;

IF OBJECT_ID('dbo.OrderItems', 'U') IS NOT NULL
    DROP TABLE dbo.OrderItems;

IF OBJECT_ID('dbo.Orders', 'U') IS NOT NULL
    DROP TABLE dbo.Orders;

IF OBJECT_ID('dbo.Products', 'U') IS NOT NULL
    DROP TABLE dbo.Products;

IF OBJECT_ID('dbo.Categories', 'U') IS NOT NULL
    DROP TABLE dbo.Categories;
GO


-- =========================================================
-- CATEGORIES
-- =========================================================

CREATE TABLE Categories
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE
);
GO


-- =========================================================
-- PRODUCTS
-- =========================================================

CREATE TABLE Products
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    SKU NVARCHAR(100) NOT NULL UNIQUE,
    CategoryId INT NULL,
    Price DECIMAL(18,2) NOT NULL,
    StockQuantity INT NOT NULL DEFAULT 0,
    LowStockThreshold INT NOT NULL DEFAULT 5,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Products_Categories
        FOREIGN KEY (CategoryId)
        REFERENCES Categories(Id)
);
GO


-- =========================================================
-- ORDERS
-- =========================================================

CREATE TABLE Orders
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId VARCHAR(30) NOT NULL UNIQUE,
    Subtotal DECIMAL(18,2) NOT NULL,
    Discount DECIMAL(18,2) NOT NULL DEFAULT 0,
    Tax DECIMAL(18,2) NOT NULL DEFAULT 0,
    GrandTotal DECIMAL(18,2) NOT NULL,
    PaymentStatus VARCHAR(20) NOT NULL DEFAULT 'Pending',
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    TransactionId VARCHAR(100) NULL
);
GO


-- =========================================================
-- ORDER ITEMS
-- =========================================================

CREATE TABLE OrderItems
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    LineTotal DECIMAL(18,2) NOT NULL,

    CONSTRAINT FK_OrderItems_Orders
        FOREIGN KEY (OrderId)
        REFERENCES Orders(Id),

    CONSTRAINT FK_OrderItems_Products
        FOREIGN KEY (ProductId)
        REFERENCES Products(Id)
);
GO


-- =========================================================
-- WEBHOOK LOGS
-- =========================================================

CREATE TABLE WebhookLogs
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId VARCHAR(30) NOT NULL,
    Status VARCHAR(20) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    TransactionId VARCHAR(100) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE()
);
GO


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX IX_Products_Name
ON Products(Name);
GO

CREATE INDEX IX_Products_SKU
ON Products(SKU);
GO

CREATE INDEX IX_Products_CategoryId
ON Products(CategoryId);
GO

CREATE INDEX IX_Orders_CreatedAt_Status
ON Orders(CreatedAt, PaymentStatus);
GO

CREATE INDEX IX_OrderItems_OrderId
ON OrderItems(OrderId);
GO

CREATE INDEX IX_OrderItems_ProductId
ON OrderItems(ProductId);
GO

CREATE INDEX IX_WebhookLogs_OrderId
ON WebhookLogs(OrderId);
GO


-- =========================================================
-- VERIFY TABLES
-- =========================================================

SELECT
    name AS TableName
FROM sys.tables
WHERE name IN
(
    'Categories',
    'Products',
    'Orders',
    'OrderItems',
    'WebhookLogs'
)
ORDER BY name;
GO