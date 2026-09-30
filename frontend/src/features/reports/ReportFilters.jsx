function ReportFilters({
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange,
    onGenerate,
    onExport
}) {
    return (
        <div className="report-filters">

            <div className="report-filter-group">
                <label>From Date</label>

                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) =>
                        onFromDateChange(e.target.value)
                    }
                />
            </div>

            <div className="report-filter-group">
                <label>To Date</label>

                <input
                    type="date"
                    value={toDate}
                    onChange={(e) =>
                        onToDateChange(e.target.value)
                    }
                />
            </div>

            <button
                className="primary-button"
                onClick={onGenerate}
            >
                Generate Report
            </button>

            <button
                className="secondary-button"
                onClick={onExport}
            >
                Export CSV
            </button>

        </div>
    );
}

export default ReportFilters;