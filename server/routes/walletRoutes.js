import express from "express";
import {
  getMyWallet,
  rechargeWallet,
  payPendingFine,
} from "../controllers/walletController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { User } from "../models/userModel.js";

const router = express.Router();

router.get("/me", isAuthenticated, getMyWallet);
router.post("/recharge", isAuthenticated, rechargeWallet);
router.post("/pay-fine", isAuthenticated, payPendingFine);

router.post("/refund-deposit", isAuthenticated, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 🚫 Already refunded
  if (user.wallet.securityDeposit <= 0) {
    return res.status(400).json({
      message: "No active security deposit found",
    });
  }

  // 🚫 Cannot refund if books still rented
  if (user.rentedBooks.length > 0) {
    return res.status(400).json({
      message: "Return all borrowed books before requesting refund",
    });
  }

  // 🚫 Cannot refund if pending fine exists
  if (user.pendingFine > 0) {
    return res.status(400).json({
      message: "Clear pending fine before requesting refund",
    });
  }

  // 🔁 Refund logic
  user.wallet.securityDeposit = 0;

  user.wallet.transactions.push({
    type: "DEPOSIT_REFUND",
    amount: 1000,
    description: "Security deposit refunded after account clearance",
  });

  await user.save();

  res.status(200).json({
    success: true,
    message: "Security deposit refunded successfully",
  });
});

export default router;