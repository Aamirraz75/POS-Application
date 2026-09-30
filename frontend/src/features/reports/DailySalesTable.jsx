function DailySalesTable({
    report,
    formatCurrency,
    formatDate
}) {
    return (
        <div className="table-card">

            <table>

                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Total Orders</th>
                        <th>Revenue</th>
                        <th>Discount</th>
                    </tr>
                </thead>

                <tbody>

                    {report.map((item, index) => (

                        <tr key={index}>

                            <td>
                                {formatDate(
                                    item.ReportDate
                                )}
                            </td>

                            <td>
                                {item.TotalOrders}
                            </td>

                            <td>
                                {formatCurrency(
                                    item.TotalRevenue
                                )}
                            </td>

                            <td>
                                {formatCurrency(
                                    item.TotalDiscount
                                )}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default DailySalesTable;