export const calculateFine = (dueDate, bookPrice) => {
  const today = new Date();

  // Grace period: 1 day
  const gracePeriodInMs = 24 * 60 * 60 * 1000;

  if (today <= new Date(dueDate).getTime() + gracePeriodInMs) {
    return 0;
  }

  const diffInMs = today - dueDate;

  const lateDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  const finePerDay = 10; // ₹10 per day

  let fine = lateDays * finePerDay;

  // Maximum fine cap (cannot exceed book price)
  if (fine > bookPrice) {
    fine = bookPrice;
  }

  return fine;
};