function parseCustomDate(str) {
  const [day, month, year] = str.split(".").map(Number);
  return new Date(year, month - 1, day);
}

export const addMonthToDate = (dateStr, monthCount) => {
  const date = parseCustomDate(dateStr);
  date.setMonth(date.getMonth() + monthCount);

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}.${mm}.${yyyy}`;
}