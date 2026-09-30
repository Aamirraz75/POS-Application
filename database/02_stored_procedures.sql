-- =========================================================
-- 02_stored_procedures.sql
-- POS Billing & Inventory Management System
-- =========================================================

USE POSDB;
GO


-- =========================================================
-- CREATE ORDER
-- =========================================================

CREATE OR ALTER PROCEDURE dbo.sp_CreateOrder
(
    @OrderId VARCHAR(30),
    @Subtotal DECIMAL(18,2),
    @Discount DECIMAL(18,2),
    @Tax DECIMAL(18,2),
    @GrandTotal DECIMAL(18,2),
    @Items NVARCHAR(MAX)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        BEGIN TRANSACTION;

        -- Create Order
        INSERT INTO Orders
        (
            OrderId,
            Subtotal,
            Discount,
            Tax,
            GrandTotal,
            PaymentStatus
        )
        VALUES
        (
            @OrderId,
            @Subtotal,
            @Discount,
            @Tax,
            @GrandTotal,
            'Pending'
        );

        DECLARE @InternalOrderId INT;

        SET @InternalOrderId = SCOPE_IDENTITY();

        -- Create Order Items
        INSERT INTO OrderItems
        (
            OrderId,
            ProductId,
            Quantity,
            UnitPrice,
            LineTotal
        )
        SELECT
            @InternalOrderId,
            ProductId,
            Quantity,
            UnitPrice,
            Quantity * UnitPrice
        FROM OPENJSON(@Items)
        WITH
        (
            ProductId INT '$.productId',
            Quantity INT '$.quantity',
            UnitPrice DECIMAL(18,2) '$.unitPrice'
        );

        COMMIT TRANSACTION;

        SELECT
            @OrderId AS OrderId,
            @GrandTotal AS GrandTotal,
            'Pending' AS PaymentStatus;

    END TRY

    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;

    END CATCH
END;
GO


-- =========================================================
-- PROCESS PAYMENT
-- =========================================================

CREATE OR ALTER PROCEDURE dbo.sp_ProcessPayment
(
    @OrderId VARCHAR(30),
    @Status VARCHAR(20),
    @Amount DECIMAL(18,2),
    @TransactionId VARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        BEGIN TRANSACTION;

        DECLARE
            @InternalOrderId INT,
            @GrandTotal DECIMAL(18,2),
            @PaymentStatus VARCHAR(20);

        -- Get order
        SELECT
            @InternalOrderId = Id,
            @GrandTotal = GrandTotal,
            @PaymentStatus = PaymentStatus
        FROM Orders
        WHERE OrderId = @OrderId;

        -- Order not found
        IF @InternalOrderId IS NULL
        BEGIN
            THROW 50001, 'Order not found', 1;
        END;

        -- Duplicate payment protection
        IF @PaymentStatus = 'Paid'
        BEGIN
            THROW 50002, 'Order is already paid', 1;
        END;

        -- Amount validation
        IF @Status = 'success'
           AND @Amount <> @GrandTotal
        BEGIN
            THROW 50003,
                  'Payment amount does not match order amount',
                  1;
        END;

        -- Successful payment
        IF @Status = 'success'
        BEGIN

            -- Check stock first
            IF EXISTS
            (
                SELECT 1
                FROM OrderItems oi
                INNER JOIN Products p
                    ON oi.ProductId = p.Id
                WHERE oi.OrderId = @InternalOrderId
                  AND p.StockQuantity < oi.Quantity
            )
            BEGIN
                THROW 50004, 'Insufficient stock', 1;
            END;

            -- Reduce inventory
            UPDATE p
            SET p.StockQuantity = p.StockQuantity - oi.Quantity
            FROM Products p
            INNER JOIN OrderItems oi
                ON p.Id = oi.ProductId
            WHERE oi.OrderId = @InternalOrderId;

            -- Mark order as Paid
            UPDATE Orders
            SET
                PaymentStatus = 'Paid',
                TransactionId = @TransactionId
            WHERE Id = @InternalOrderId;

        END

        -- Failed payment
        ELSE IF @Status = 'failed'
        BEGIN

            UPDATE Orders
            SET
                PaymentStatus = 'Failed',
                TransactionId = @TransactionId
            WHERE Id = @InternalOrderId;

        END

        ELSE
        BEGIN
            THROW 50005, 'Invalid payment status', 1;
        END;

        -- Log webhook
        INSERT INTO WebhookLogs
        (
            OrderId,
            Status,
            Amount,
            TransactionId
        )
        VALUES
        (
            @OrderId,
            @Status,
            @Amount,
            @TransactionId
        );

        COMMIT TRANSACTION;

        SELECT
            @OrderId AS OrderId,
            @Status AS PaymentStatus,
            @TransactionId AS TransactionId;

    END TRY

    BEGIN CATCH

        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;

    END CATCH
END;
GO