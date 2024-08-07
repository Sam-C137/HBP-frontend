export type BookingTrends = {
    metric: string;
    month: string;
    year: string;
};

export type PatientFeedback = {
    totalReviews: number;
    data: Record<string, number>;
};

export type ReportPayload = {
    type: string;
    startDate: string;
    endDate: string;
    metric: string;
    serviceId: string;
    doctorId: string;
};
