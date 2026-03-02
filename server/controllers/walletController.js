import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";

// 💳 Get wallet details
export const getMyWallet = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    wallet: user.wallet,
    pendingFine: user.pendingFine,
  });
});

// 💰 Recharge wallet
export const rechargeWallet = catchAsyncErrors(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return next(new ErrorHandler("Invalid recharge amount", 400));
  }

  const user = await User.findById(req.user._id);

  user.wallet.balance += amount;

  user.wallet.transactions.push({
    type: "RECHARGE",
    amount,
    description: "Wallet recharge",
  });

  user.notifications.push({
  message: `Wallet recharged successfully with ₹${amount}`,
  type: "SUCCESS"
});


  await user.save();

  res.status(200).json({
    success: true,
    message: "Wallet recharged successfully",
    balance: user.wallet.balance,
  });

});

// 💸 Pay pending fine
export const payPendingFine = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (user.wallet.balance < user.pendingFine) {
    return next(new ErrorHandler("Insufficient wallet balance", 400));
  }
  const fineAmount = user.pendingFine;
  user.wallet.balance -= fineAmount;

  user.wallet.transactions.push({
    type: "FINE",
    amount: user.pendingFine,
    description: "Pending fine payment",
  });

  user.pendingFine = 0;

  user.notifications.push({
  message: `Fine of ₹${fineAmount} has been applied.`,
  type: "WARNING"
});
  await user.save();

  res.status(200).json({
    success: true,
    message: "Pending fine cleared",
    balance: user.wallet.balance,
  });
});