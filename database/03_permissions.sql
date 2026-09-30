-- =========================================================
-- 03_permissions.sql
-- POS Billing & Inventory Management System
-- =========================================================

USE POSDB;
GO

-- Grant permissions to application database user
GRANT EXECUTE ON OBJECT::dbo.sp_CreateOrder
TO admin;
GO

GRANT EXECUTE ON OBJECT::dbo.sp_ProcessPayment
TO admin;
GO