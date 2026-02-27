import React, { useEffect, useState } from "react";
import API from "../utils/axiosConfig";
import { toast } from "react-toastify";
import Header from "../layout/Header";
import { useDispatch } from "react-redux";
import { getUser } from "../store/slices/authSlice";

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");
  const dispatch = useDispatch();

  const refundDeposit = async () => {
  try {
    await API.post("/api/v1/wallet/refund-deposit");

    toast.success("Deposit refunded successfully");

    fetchWallet();
    dispatch(getUser());
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Refund failed"
    );
  }
};

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const { data } = await API.get("/api/v1/wallet/me");
      setWallet(data);
    } catch (error) {
      toast.error("Failed to load wallet");
    }
  };

  /* ---------------- RAZORPAY LOADER ---------------- */
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  /* ---------------- WALLET RECHARGE ---------------- */
  const recharge = async () => {
    if (!amount || amount < 100) {
      toast.error("Minimum recharge amount is ₹100");
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    try {
      const { data: order } = await API.post(
        "/api/v1/payment/wallet/create-order",
        { amount: Number(amount) }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: "INR",
        name: "BookWorm Library",
        description: "Wallet Recharge",
        order_id: order.id,

        handler: async function (response) {
          await API.post("/api/v1/payment/wallet/verify", {
            ...response,
            amount: Number(amount),
          });

          toast.success("Wallet recharged successfully");
          setAmount("");

          fetchWallet();
          dispatch(getUser());
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Recharge failed");
    }
  };

  /* ---------------- PAY PENDING FINE ---------------- */
  const payFine = async () => {
    try {
      await API.post("/api/v1/wallet/pay-fine");
      toast.success("Fine paid successfully");
      fetchWallet();
      dispatch(getUser());
    } catch (error) {
      toast.error("Not enough balance");
    }
  };

  if (!wallet) return <p className="p-6">Loading...</p>;

  return (
    <main className="relative flex-1 p-6 pt-28">
      <Header />

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">My Wallet</h2>

        {/* Wallet Summary */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <p className="text-gray-600">Available Balance</p>
          <h3 className="text-3xl font-bold text-green-600">
            ₹{wallet.wallet.balance}
          </h3>

          <p className="mt-2">
            Security Deposit: ₹{wallet.wallet.securityDeposit}
          </p>

          {wallet.wallet.securityDeposit >= 1000 && (
  <button
    onClick={refundDeposit}
    className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
  >
    Refund Security Deposit
  </button>
)}

          <p className="mt-4 text-red-500">
            Pending Fine: ₹{wallet.pendingFine}
          </p>

          {wallet.pendingFine > 0 && (
            <button
              onClick={payFine}
              className="mt-3 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Pay Pending Fine
            </button>
          )}
        </div>

        {/* Recharge Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <h4 className="font-semibold mb-3">Recharge Wallet</h4>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount (min ₹100)"
            className="border p-2 rounded w-48"
          />

          <button
            onClick={recharge}
            className="ml-3 bg-black text-white px-4 py-2 rounded hover:shadow-lg transition"
          >
            Recharge
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h4 className="font-semibold mb-4">Transaction History</h4>

          {wallet.wallet.transactions.length === 0 ? (
            <p>No transactions yet</p>
          ) : (
            wallet.wallet.transactions
              .slice()
              .reverse()
              .map((t, index) => (
                <div
                  key={index}
                  className="border-b py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{t.description}</p>
                    <p className="text-sm text-gray-500">
  {t.createdAt
    ? new Date(t.createdAt).toLocaleString()
    : "—"}
</p>
                  </div>

                  <p
                    className={`font-semibold ${
                      t.type === "CREDIT"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {t.type === "CREDIT" ? "+" : "-"}₹{t.amount}
                  </p>
                </div>
              ))
          )}
        </div>
      </div>
    </main>
  );
};

export default Wallet;