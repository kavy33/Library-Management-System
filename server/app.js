import express from "express";
import { config } from  "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connect } from "mongoose";
import { connnectDB } from "./database/db.js";
import { errorMiddlewares } from "./middlewares/errorMiddlewares.js";
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import userRouter from "./routes/userRouter.js";

import expressFileupload from "express-fileupload";
import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
config();





export const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressFileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",

}));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/payment/admin/transactions", paymentRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/notifications", notificationRoutes);



notifyUsers();
removeUnverifiedAccounts();
connnectDB();
app.use(errorMiddlewares);