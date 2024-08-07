export interface Statistics extends ChartData {
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    completedPercentageChange: number;
    cancelledPercentageChange: number;
    totalPercentageChange: number;
}

export type ChartData = {
    total: number[];
    cancelled: number[];
    completed: number[];
};
