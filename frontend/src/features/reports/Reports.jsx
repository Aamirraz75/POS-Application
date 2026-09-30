import { useState } from "react";

import {
    getDailyReport,
    exportReportCSV
} from "../../services/reportService";

import ReportFilters from "./ReportFilters";
import ReportSummary from "./ReportSummary";
import DailySalesTable from "./DailySalesTable";

import "./Reports.css";

function Reports() {

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [report, setReport] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // Generate daily report
    const generateReport = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getDailyReport(
                    fromDate,
                    toDate
                );

            const data =
                Array.isArray(response.data?.data)
                    ? response.data.data
                    : [];

            setReport(data);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to generate report."
            );

            setReport([]);

        } finally {

            setLoading(false);

        }
    };


    // Export CSV
    const downloadCSV = async () => {

        try {

            setError("");

            const response =
                await exportReportCSV(
                    fromDate,
                    toDate
                );

            const blob = new Blob(
                [response.data],
                {
                    type: "text/csv;charset=utf-8;"
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;
            link.download = "sales-report.csv";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error(err);

            setError(
                "Failed to download CSV."
            );
        }
    };


    const formatCurrency = (value) => {
        return `₹${Number(value || 0).toFixed(2)}`;
    };


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date)
            .toLocaleDateString("en-IN");
    };


    // Summary calculations

    const totalOrders = report.reduce(
        (sum, item) =>
            sum + Number(item.TotalOrders || 0),
        0
    );

    const totalRevenue = report.reduce(
        (sum, item) =>
            sum + Number(item.TotalRevenue || 0),
        0
    );

    const totalDiscount = report.reduce(
        (sum, item) =>
            sum + Number(item.TotalDiscount || 0),
        0
    );


    return (
        <div className="page-container reports-page">

            {/* Header */}

            <div className="page-header">

                <div>

                    <h1>Sales Reports</h1>

                    <p>
                        View daily sales,
                        revenue and discounts
                    </p>

                </div>

            </div>


            {/* Filters */}

            <ReportFilters
                fromDate={fromDate}
                toDate={toDate}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
                onGenerate={generateReport}
                onExport={downloadCSV}
            />


            {/* Loading */}

            {loading && (
                <div className="table-card">
                    <p>Loading report...</p>
                </div>
            )}


            {/* Error */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* Report */}

            {!loading && report.length > 0 && (
                <>

                    <h2>Sales Summary</h2>

                    <ReportSummary
                        totalOrders={totalOrders}
                        totalRevenue={totalRevenue}
                        totalDiscount={totalDiscount}
                        formatCurrency={formatCurrency}
                    />


                    <h2>Daily Sales</h2>

                    <DailySalesTable
                        report={report}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                    />

                </>
            )}


            {/* No Data */}

            {!loading &&
            !error &&
            report.length === 0 && (

                <div className="table-card">
                    <p>No sales data found.</p>
                </div>

            )}

        </div>
    );
}

export default Reports;