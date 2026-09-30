function OrderFilters({
    fromDate,
    toDate,
    paymentStatus,
    onFromDateChange,
    onToDateChange,
    onPaymentStatusChange,
    onClear
}) {
    return (
        <div className="filter-card">

            <div className="filter-group">
                <label>From Date</label>

                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) =>
                        onFromDateChange(e.target.value)
                    }
                />
            </div>

            <div className="filter-group">
                <label>To Date</label>

                <input
                    type="date"
                    value={toDate}
                    onChange={(e) =>
                        onToDateChange(e.target.value)
                    }
                />
            </div>

            <div className="filter-group">
                <label>Payment Status</label>

                <select
                    value={paymentStatus}
                    onChange={(e) =>
                        onPaymentStatusChange(e.target.value)
                    }
                >
                    <option value="">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                </select>
            </div>

            <button
                className="secondary-button"
                onClick={onClear}
            >
                Clear Filters
            </button>

        </div>
    );
}

export default OrderFilters;