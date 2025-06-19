export const generateYearRange = (range: number = 2) => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let i = currentYear - range; i <= currentYear + range; i++) {
        years.push(i);
    }

    return years;
};