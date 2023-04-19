export const getTommorow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date;
};

export const isDay = (startDay: string, endDay: string): boolean => {
  const [hoursStart, minutesStart] = startDay.split("T")[1].split(":").map(Number);
  const [hoursEnd, minutesEnd] = endDay.split("T")[1].split(":").map(Number);
  const [hoursNow, minutesNow] = new Date().toLocaleTimeString("fr-FR").split(":").map(Number);
  return (
    (hoursStart < hoursNow && hoursNow < hoursEnd) ||
    (hoursStart === hoursNow && minutesStart < minutesNow) ||
    (hoursNow === hoursEnd && minutesNow < minutesEnd)
  );
};

export const SecondsToCron = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const cron = `${seconds % 60} ${minutes % 60} ${hours % 24} * * *`;
  return cron;
};
