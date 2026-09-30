import api from "./api";

export const getDailyReport = (fromDate, toDate) => {
    return api.get("/reports/daily", {
        params: {
            fromDate: fromDate || undefined,
            toDate: toDate || undefined
        }
    });
};

export const exportReportCSV = (fromDate, toDate) => {
    return api.get("/reports/export", {
        params: {
            fromDate: fromDate || undefined,
            toDate: toDate || undefined
        },
        responseType: "blob"
    });
};