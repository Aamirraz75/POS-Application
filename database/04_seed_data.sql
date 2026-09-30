USE POSDB;
GO

INSERT INTO Categories(Name)
VALUES
('Electronics'),
('Accessories'),
('Stationery');

INSERT INTO Products
    (Name, SKU, CategoryId, Price, StockQuantity, LowStockThreshold)
VALUES
('Wireless Mouse', 'MOU-001', 2, 500, 25, 5),
('Keyboard', 'KEY-001', 2, 900, 15, 5),
('Laptop', 'LAP-001', 1, 55000, 8, 3),
('Notebook', 'NOTE-001', 3, 120, 40, 10);
