const reportRepository = require("../repositories/reportRepository");

async function getDailyReport(filters) {

    return await reportRepository.getDailyReport(
        filters.fromDate,
        filters.toDate
    );
}

async function getOrdersForExport(filters) {

    return await reportRepository.getOrdersForExport(
        filters.fromDate,
        filters.toDate,
        filters.paymentStatus
    );
}

module.exports = {
    getDailyReport,
    getOrdersForExport
};