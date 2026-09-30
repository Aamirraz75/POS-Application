require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { getPool } = require("./src/db/db");

const productRoutes = require("./src/routes/productRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const webhookRoutes = require("./src/routes/webhookRoutes");
const reportRoutes = require("./src/routes/reportRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/reports", reportRoutes);

app.get("/api/health", async (req, res) => {
    try {

        const pool = await getPool();

        const result = await pool
            .request()
            .query("SELECT DB_NAME() AS DatabaseName");

        res.json({
            success: true,
            message: "API and database are working",
            database: result.recordset[0].DatabaseName
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});