// Utility functions for bill calculations and reminders

export const calculateDaysUntilDeadline = (deadlineDate) => {
  const now = new Date();
  const deadline = new Date(deadlineDate);
  const daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  return daysRemaining;
};

export const isOverdue = (deadlineDate) => {
  const now = new Date();
  const deadline = new Date(deadlineDate);
  return now > deadline;
};

export const getReminderType = (daysUntilDeadline, isOverdue) => {
  if (isOverdue) return 'overdue';
  if (daysUntilDeadline <= 3 && daysUntilDeadline > 0) return 'urgent';
  if (daysUntilDeadline <= 7 && daysUntilDeadline > 3) return 'warning';
  if (daysUntilDeadline > 7) return 'notice';
  return 'none';
};

export const calculateFine = (billAmount) => {
  const FINE_PERCENTAGE = 0.10; // 10% fine
  const CGST = 0.09; // 9% CGST
  const SGST = 0.09; // 9% SGST
  
  const fineAmount = billAmount * FINE_PERCENTAGE;
  const cgstOnFine = fineAmount * CGST;
  const sgstOnFine = fineAmount * SGST;
  const totalFineWithTax = fineAmount + cgstOnFine + sgstOnFine;
  
  return {
    fineAmount: parseFloat(fineAmount.toFixed(2)),
    cgstOnFine: parseFloat(cgstOnFine.toFixed(2)),
    sgstOnFine: parseFloat(sgstOnFine.toFixed(2)),
    totalFineWithTax: parseFloat(totalFineWithTax.toFixed(2))
  };
};

export const generateReminderMessage = (reminderType, daysUntilDeadline, deadlineDate) => {
  const date = new Date(deadlineDate).toDateString();
  
  switch (reminderType) {
    case 'overdue':
      return `⚠️ OVERDUE: Your bill payment was due on ${date}. Please pay immediately to avoid further penalties.`;
    case 'urgent':
      return `🔴 URGENT: Only ${daysUntilDeadline} day(s) left to pay your bill! Deadline: ${date}`;
    case 'warning':
      return `🟡 REMINDER: Your bill is due in ${daysUntilDeadline} days. Deadline: ${date}`;
    case 'notice':
      return `ℹ️ Upcoming Bill: Your next payment is due on ${date} (${daysUntilDeadline} days remaining)`;
    default:
      return '';
  }
};

export const formatCurrency = (amount) => {
  return `₹${parseFloat(amount).toFixed(2)}`;
};

export const getTotalAmountDue = (billAmount, fineDetails) => {
  if (fineDetails && fineDetails.totalFineWithTax) {
    return billAmount + fineDetails.totalFineWithTax;
  }
  return billAmount;
};
