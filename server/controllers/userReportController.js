import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userModel.js";

// 📊 USER ANALYTICS DASHBOARD
export const getUserAnalytics = catchAsyncErrors(async (req, res) => {

  const user = await User.findById(req.user._id);

  // 📚 Borrow Summary
  const totalBorrowed = user.borrowedBooks.length;
  const currentlyBorrowed = user.borrowedBooks.filter(b => !b.returned).length;

  // 💰 Wallet Transactions Summary
  let totalSpent = 0;
  let totalFines = 0;

  user.wallet.transactions.forEach(tx => {
    if (tx.type === "RENTAL") {
      totalSpent += tx.amount;
    }
    if (tx.type === "FINE") {
      totalFines += tx.amount;
      totalSpent += tx.amount;
    }
  });

// 📅 Generate Last 6 Months
const monthlyData = {};
const now = new Date();

for (let i = 5; i >= 0; i--) {
  const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
  const month = date.toLocaleString("default", { month: "short" });
  monthlyData[month] = 0;
}

// Fill Actual Transaction Data
user.wallet.transactions.forEach(tx => {
  const date = new Date(tx.createdAt);
  const month = date.toLocaleString("default", { month: "short" });

  if (monthlyData.hasOwnProperty(month)) {
    if (tx.type === "RENTAL" || tx.type === "FINE") {
      monthlyData[month] += tx.amount;
    }
  }
});

const chartData = Object.keys(monthlyData).map(month => ({
  month,
  amount: monthlyData[month]
}));

  res.status(200).json({
    success: true,
    analytics: {
      totalBorrowed,
      currentlyBorrowed,
      totalSpent,
      totalFines,
      currentBalance: user.wallet.balance,
      chartData
    }
  });

});