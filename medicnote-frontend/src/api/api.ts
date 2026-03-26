export const mockAppointments = [
    { id: 1, date: "2026-03-23", time: "10:00 AM", patientName: "John", status: "Pending" },
];

export const getAppointmentsByDate = (date: string) => {
    return mockAppointments.filter((a) => a.date === date);
};

export const getWeeklyChartData = () => {
    return [
        { day: "Mon", appointments: 4 },
        { day: "Tue", appointments: 6 },
        { day: "Wed", appointments: 3 },
        { day: "Thu", appointments: 5 },
        { day: "Fri", appointments: 2 },
        { day: "Sat", appointments: 1 },
        { day: "Sun", appointments: 0 },
    ];
};

export const getAppointmentStats = () => {
    return {
        total: 10,
        completed: 6,
        pending: 4,
        today: 3,
    };
};