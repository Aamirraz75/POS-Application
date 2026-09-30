const sql = require("mssql/msnodesqlv8");

const config = {
    server: "DESKTOP-BAJK80S\\SQLEXPRESS",
    database: "POSDB",

    options: {
        trustedConnection: true,
        trustServerCertificate: true,
        driver: "ODBC Driver 17 for SQL Server"
    }
};

async function testConnection() {
    try {
        console.log("Connecting to SQL Server...");

        const pool = await sql.connect(config);

        console.log("✅ SQL SERVER CONNECTED");

        const result = await pool.request().query(`
            SELECT
                @@SERVERNAME AS ServerName,
                DB_NAME() AS DatabaseName,
                SUSER_SNAME() AS CurrentUser
        `);

        console.table(result.recordset);

        await pool.close();

    } catch (error) {
        console.log("❌ CONNECTION FAILED");
        console.dir(error, { depth: null });
    }
}

testConnection();