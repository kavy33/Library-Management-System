import axios from "axios";
import { toast } from "react-toastify";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const DepositPayment = () => {
  const handlePayment = async () => {
    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    const { data: order } = await axios.post(
      "/api/payment/create-order",
      {},
      { withCredentials: true }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount,
      currency: "INR",
      name: "BookWorm Library",
      description: "₹1000 Security Deposit",
      order_id: order.id,

      handler: async function (response) {
        await axios.post(
          "/api/payment/verify",
          response,
          { withCredentials: true }
        );

        toast.success("Deposit paid successfully");
        window.location.href = "/books";
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <h2 className="text-xl font-semibold mb-4">
        Pay ₹1000 Security Deposit
      </h2>

      <button
        onClick={handlePayment}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Pay Now
      </button>
    </div>
  );
};

export default DepositPayment;
