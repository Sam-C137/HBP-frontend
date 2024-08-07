/* eslint-disable */
export class DateBuilder {
    static months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    static days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    static yearGenerator = (limit: number) =>
        Array.from({ length: limit }, (_, k) =>
            (new Date().getFullYear() - k).toString(),
        );

    static handlePrev = (
        date = new Date(),
        viewmode: "day" | "month" | "week" | "year",
    ) => {
        switch (viewmode) {
            case "day":
                const newDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate() - 1,
                );
                return newDate;
            case "week":
                const week = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate() - 7,
                );
                return week;
            case "month":
                const month = new Date(date.getFullYear(), date.getMonth() - 1);
                return month;
            case "year":
                const year = new Date(
                    date.getFullYear() - 1,
                    date.getMonth(),
                    date.getDate(),
                );
                return year;
        }
    };

    static handleNext = (
        date = new Date(),
        viewmode: "day" | "month" | "week" | "year",
    ) => {
        switch (viewmode) {
            case "day":
                const newDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate() + 1,
                );
                return newDate;
            case "week":
                const week = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate() + 7,
                );
                return week;
            case "month":
                const month = new Date(date.getFullYear(), date.getMonth() + 1);
                return month;
            case "year":
                const year = new Date(
                    date.getFullYear() + 1,
                    date.getMonth(),
                    date.getDate(),
                );
                return year;
        }
    };

    static generateWeekDays = (date = new Date()) => {
        // starts on Sunday
        const firstDayOfWeek = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - date.getDay(),
        );

        const weekDays = [];

        for (let i = 0; i < 7; i++) {
            const weekDate = new Date(
                firstDayOfWeek.getTime() + i * 24 * 60 * 60 * 1000,
            );

            if (weekDate.getMonth() === firstDayOfWeek.getMonth()) {
                weekDays.push(weekDate);
            } else {
                weekDays.push(weekDate);
            }
        }

        return weekDays;
    };

    static getStartOfWeek = (date: Date): Date => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return startOfWeek;
    };

    static getEndOfWeek = (date: Date): Date => {
        const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() + (7 - (date.getDay() % 7)));
        endOfWeek.setHours(23, 59, 59, 999);
        return endOfWeek;
    };

    static getEndOfMonth = (date: Date): Date => {
        const endOfMonth = new Date(date);
        endOfMonth.setMonth(date.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);
        return endOfMonth;
    };

    static getStartOfMonth = (date: Date): Date => {
        const startOfMonth = new Date(date);
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        return startOfMonth;
    };

    static getStartOfYear = (date: Date): Date => {
        const startOfYear = new Date(date);
        startOfYear.setMonth(0);
        startOfYear.setDate(1);
        startOfYear.setHours(0, 0, 0, 0);
        return startOfYear;
    };

    static getEndOfYear = (date: Date): Date => {
        const endOfYear = new Date(date);
        endOfYear.setMonth(11);
        endOfYear.setDate(31);
        endOfYear.setHours(23, 59, 59, 999);
        return endOfYear;
    };

    static compare = (
        date1: Date | string,
        date2: Date | string,
        operator: "<" | ">" | "<=" | ">=" | "===",
    ): boolean => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);

        switch (operator) {
            case "<":
                return d1 < d2;
            case ">":
                return d1 > d2;
            case "<=":
                return d1 <= d2;
            case ">=":
                return d1 >= d2;
            case "===":
                return d1.toDateString() === d2.toDateString();
        }
    };

    static getFormattedDate(date: Date) {
        const year = date.getFullYear().toString().padStart(4, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    static daysToMilliseconds(days: number) {
        return days * 24 * 60 * 60 * 1000;
    }
}
