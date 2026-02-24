import bcrypt from "bcrypt";
import cloudinary from "cloudinary";

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find( {accountVerified: true}); 
    res.status(200).json({
        success: true,
        users,
    });
});

export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
    
    if(!req.files || Object.keys(req.files).length ===0){
        return next (new ErrorHandler("Admin avatar is required.", 400));
           

    }
    const { name, email, password} = req.body;
    if(!name || !email || !password){
        return next (new ErrorHandler("Please provide all required fields.", 400));
    }
    const isRegistered = await User.findOne({ email,accountVerified: true});
    if(isRegistered){
        return next (new ErrorHandler("User already registered.", 400));
    }
    if(password.length < 8 || password.length > 20){
        return next (new ErrorHandler("Password must be between 8 and 20 characters.", 400));
    }
    const {avatar} = req.files;
    const allowedFormats = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
    if(!allowedFormats.includes(avatar.mimetype)){
        return next (new ErrorHandler("Only jpg, jpeg, png, webp formats are allowed for avatar.", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath, {
        folder: "LIBRARY_MANAGEMENT_SYSTEM_ADMIN_AVATARS",

  });
  if(!cloudinaryResponse || cloudinaryResponse.error){
    console.error("Cloudinary error:", cloudinaryResponse.error || "Unknown cloudinary error");
    return next (new ErrorHandler("Failed to upload avatar. Please try again.", 500));
  }
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Admin",
    accountVerified: true,
    avatar: {
        public_id: cloudinaryResponse.public_id, 
        url: cloudinaryResponse.secure_url,
    }

});
res.status(201).json({
    success: true,
    message: "Admin registered successfully.",
    admin: user,
});

});

export const toggleUserBlock = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // 🚫 Prevent blocking Admin
  if (user.role === "Admin") {
    return next(new ErrorHandler("Cannot block an Admin", 400));
  }

  // Toggle block status
  user.isBlocked = !user.isBlocked;
  await user.save();

  // 📧 SEND EMAIL WHEN BLOCKED
  if (user.isBlocked) {
    await sendEmail({
      email: user.email,
      subject: "Account Suspended - BookWorm Library",
      message: `
Dear ${user.name},

We regret to inform you that your BookWorm Library account has been temporarily suspended by the administration.

During this time, you will not be able to borrow books or access certain features.

If you believe this action was taken in error or would like clarification, please contact us:

📧 Email: kavypatel19112005@gmail.com
📞 Phone: +91 8866000601

We are happy to assist you.

Regards,
BookWorm Library Administration
      `,
    });
  }

  // 📧 SEND EMAIL WHEN UNBLOCKED
  if (!user.isBlocked) {
    await sendEmail({
      email: user.email,
      subject: "Account Reactivated - BookWorm Library",
      message: `
Dear ${user.name},

Good news! Your BookWorm Library account has been reactivated.

You may now continue borrowing books and using our services.

Thank you for your cooperation.

Regards,
BookWorm Library Team
      `,
    });
  }

  res.status(200).json({
    success: true,
    message: user.isBlocked
      ? "User blocked successfully and email sent."
      : "User unblocked successfully and email sent.",
  });
});

