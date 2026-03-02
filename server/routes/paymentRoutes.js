import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { User } from "../models/userModel.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { getAllTransactions } from "../controllers/adminAnalyticsController.js";

const router = express.Router();

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};


// 1️⃣ Create order
router.post("/create-order", isAuthenticated, async (req, res, next) => {
    const razorpay = getRazorpayInstance();

  const order = await razorpay.orders.create({
    amount: 1000 * 100,
    currency: "INR",
    receipt: `deposit_${req.user._id}`,
  });

  res.status(200).json(order);
});

// 2️⃣ Verify payment
router.post("/verify", isAuthenticated, async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSign !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 🚫 Prevent double deposit
  if (user.wallet.securityDeposit >= 1000) {
    return res.status(400).json({
      message: "Security deposit already paid",
    });
  }

  // 💰 Add deposit to wallet.securityDeposit
  user.wallet.securityDeposit = 1000;

  // 📜 Add transaction history
  user.wallet.transactions.push({
    type: "DEPOSIT",
    amount: 1000,
    description: "Security deposit via Razorpay",
  });

  await user.save();

  res.status(200).json({
    success: true,
    message: "Security deposit added successfully",
  });
});

// 3️⃣ Create wallet recharge order
router.post("/wallet/create-order", isAuthenticated, async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) < 100) {
      return res.status(400).json({
        message: "Minimum recharge amount is ₹100",
      });
    }

    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
     receipt: `w_${req.user._id}`
    });

    res.status(200).json(order);

  } catch (error) {
    console.log("RAZORPAY ERROR:", error);
    next(error);
  }
});
// 4️⃣ Verify wallet recharge
router.post("/wallet/verify", isAuthenticated, async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;

    console.log("VERIFY BODY:", req.body);

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wallet.balance += Number(amount);

    user.wallet.transactions.push({
      type: "RECHARGE",
      amount: Number(amount),
      description: "Wallet recharge via Razorpay",
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Wallet recharged successfully",
    });

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    next(error);
  }
});

router.get("/admin/transactions", isAuthenticated, isAuthorized("Admin"), getAllTransactions);

export default router;
