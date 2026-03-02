import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        lowercase: true,

    },
    password:{
        type: String,
        required: true,
        select: false,
    },
    role:{
        type: String,
        enum: ["Admin","User"],
        default: "User",
    },
  
    accountVerified: {
        type: Boolean,
        default: false,
    },


notifications: [
  {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["SUCCESS", "WARNING", "INFO"],
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
],
    // 💰 WALLET SYSTEM
wallet: {
  balance: {
    type: Number,
    default: 0,
  },
  securityDeposit: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      type: {
        type: String,
        enum: ["DEPOSIT", "RECHARGE", "RENTAL", "FINE", "REFUND","DEPOSIT_REFUND"],
      },
      amount: Number,
      description: String,
       createdAt: {
      type: Date,
      default: Date.now
    }
     
    },
  ],
  
},

pendingFine: {
  type: Number,
  default: 0,
},

  isBlocked: {
       type: Boolean,
       default: false,
     },
  
    borrowedBooks:[{
        bookId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Borrow",

        },
        returned:{
            type: Boolean,
            default: false,
        },
        bookTitle: String,
        borrowedDate: Date,
        dueDate: Date,
    }],
    avatar:{
        public_id: String,
        url: String,
    },
      rentedBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
},

{
    timestamps: true,
}
);

userSchema.methods.generateVerificationCode= function() {
    function generateRadndomFiveDigitNumber(){
        const firstDigit = Math.floor(Math.random() * 9) + 1;
        const remainingDigits = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0');
        return parseInt(firstDigit + remainingDigits); 

    }
    const verificationCode = generateRadndomFiveDigitNumber();
    this.verificationCode = verificationCode;
    this.verificationCodeExpire = Date.now() + 15 * 60 * 1000;
    return verificationCode;
}
userSchema.methods.generateToken = function(){
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}
userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
}

export const User = mongoose.model("User", userSchema);