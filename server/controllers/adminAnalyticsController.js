import { User } from "../models/userModel.js";

export const getPaymentAnalytics = async (req, res, next) => {
  try {
    const users = await User.find();

    let totalRevenue = 0;
    let totalFines = 0;
    let totalDeposits = 0;
    let totalRecharges = 0;

    users.forEach(user => {
      user.wallet.transactions.forEach(tx => {

        if (tx.type === "RENTAL") {
          totalRevenue += tx.amount;
        }

        if (tx.type === "FINE") {
          totalFines += tx.amount;
          totalRevenue += tx.amount;
        }

        if (tx.type === "DEPOSIT") {
          totalDeposits += tx.amount;
        }

        if (tx.type === "RECHARGE") {
          totalRecharges += tx.amount;
        }

      });
    });

    res.status(200).json({
      success: true,
      analytics: {
        totalRevenue,
        totalFines,
        totalDeposits,
        totalRecharges
      }
    });

  } catch (error) {
    next(error);
  }
};
export const getMonthlyRevenue = async (req, res) => {
  try {
    const data = await User.aggregate([
      { $unwind: "$wallet.transactions" },

      {
        $match: {
          "wallet.transactions.type": { $in: ["RENTAL", "FINE"] },
          "wallet.transactions.createdAt": { $type: "date" }
        }
      },

      {
        $group: {
          _id: {
            year: { $year: "$wallet.transactions.createdAt" },
            month: { $month: "$wallet.transactions.createdAt" }
          },
          totalRevenue: { $sum: "$wallet.transactions.amount" }
        }
      },

      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({ success: true, data });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRevenueByCategory = async (req, res, next) => {
  try {
    const data = await User.aggregate([
      { $unwind: "$wallet.transactions" },

      {
        $group: {
          _id: "$wallet.transactions.type",
          total: { $sum: "$wallet.transactions.amount" }
        }
      }
    ]);

    res.status(200).json({ success: true, data });

  } catch (error) {
    next(error);
  }
};

export const getTopPayingUsers = async (req, res, next) => {
  try {
    const data = await User.aggregate([
      { $unwind: "$wallet.transactions" },

      {
        $match: {
          "wallet.transactions.type": { $in: ["RENTAL", "FINE"] }
        }
      },

      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          email: { $first: "$email" },
          totalSpent: { $sum: "$wallet.transactions.amount" }
        }
      },

      { $sort: { totalSpent: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({ success: true, data });

  } catch (error) {
    next(error);
  }
};

export const getMostFinedUsers = async (req, res, next) => {
  try {
    const data = await User.aggregate([
      { $unwind: "$wallet.transactions" },

      {
        $match: {
          "wallet.transactions.type": "FINE"
        }
      },

      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          totalFine: { $sum: "$wallet.transactions.amount" }
        }
      },

      { $sort: { totalFine: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({ success: true, data });

  } catch (error) {
    next(error);
  }
};

export const getRefundStats = async (req, res, next) => {
  try {
    const data = await User.aggregate([
      { $unwind: "$wallet.transactions" },

      {
        $match: {
          "wallet.transactions.type": "DEPOSIT_REFUND"
        }
      },

      {
        $group: {
          _id: null,
          totalRefunded: { $sum: "$wallet.transactions.amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({ success: true, data });

  } catch (error) {
    next(error);
  }
};
export const getAllTransactions = async (req, res, next) => {
  try {
    const data = await User.aggregate([
      { $unwind: "$wallet.transactions" },
      {
        $project: {
          name: 1,
          email: 1,
          type: "$wallet.transactions.type",
          amount: "$wallet.transactions.amount",
          createdAt: "$wallet.transactions.createdAt"
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};