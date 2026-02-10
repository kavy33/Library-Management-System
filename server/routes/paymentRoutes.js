import express from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { User } from "../models/userModel.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

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
  user.depositPaid = true;
  user.depositPayment = {
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    amount: 1000,
    paidAt: new Date(),
  };

  await user.save();

  res.status(200).json({ success: true });
});

export default router;
