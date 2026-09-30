function ReportSummary({
    totalOrders,
    totalRevenue,
    totalDiscount,
    formatCurrency
}) {
    return (
        <div className="report-summary">

            {/* Total Orders */}
            <div className="report-summary-card">

                <span>Total Orders</span>

                <strong>
                    {totalOrders}
                </strong>

            </div>


            {/* Total Revenue */}
            <div className="report-summary-card">

                <span>Total Revenue</span>

                <strong>
                    {formatCurrency(totalRevenue)}
                </strong>

            </div>


            {/* Total Discount */}
            <div className="report-summary-card">

                <span>Total Discount</span>

                <strong>
                    {formatCurrency(totalDiscount)}
                </strong>

            </div>

        </div>
    );
}

export default ReportSummary;