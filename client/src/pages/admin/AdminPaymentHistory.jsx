import { useEffect, useState, useMemo } from "react";
import API from "../../utils/axiosConfig";
import Header from "../../layout/Header";

const AdminPaymentHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔎 FILTER STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    API.get("/api/v1/payment/admin/transactions")
      .then(res => {
        setTransactions(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  /*
  =====================================================
  FILTER LOGIC (All Combined)
  =====================================================
  */
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {

      // 🔎 SEARCH BY USER NAME
      const matchesSearch =
        tx.name.toLowerCase().includes(searchTerm.toLowerCase());

      // 🔎 FILTER BY TYPE
      const matchesType =
        typeFilter === "ALL" || tx.type === typeFilter;

      // 🔎 FILTER BY DATE RANGE
      const txDate = new Date(tx.createdAt);
      const matchesStart =
        !startDate || txDate >= new Date(startDate);
      const matchesEnd =
        !endDate || txDate <= new Date(endDate);

      return matchesSearch && matchesType && matchesStart && matchesEnd;
    });
  }, [transactions, searchTerm, typeFilter, startDate, endDate]);

  return (
    <main className="relative flex-1 p-5 pt-28 ">
    <Header />

    <div className="p-10 bg-gray-50 min-h-screen">

      <h2 className="text-2xl font-bold mb-6">
        All Transactions
      </h2>

      {/* ================= FILTER SECTION ================= */}

      <div className="flex flex-wrap gap-4 mb-6">

        {/* 🔎 SEARCH */}
        <input
          type="text"
          placeholder="Search by user name..."
          className="p-2 border rounded w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* 🔽 TYPE FILTER */}
        <select
          className="p-2 border rounded"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {/* 🔹 CHANGEABLE PART: Add new types here if needed */}
          <option value="ALL">All Types</option>
          <option value="RENTAL">Rental</option>
          <option value="FINE">Fine</option>
          <option value="RECHARGE">Recharge</option>
          <option value="DEPOSIT">Deposit</option>
          <option value="DEPOSIT_REFUND">Deposit Refund</option>
        </select>

        {/* 📅 START DATE */}
        <input
          type="date"
          className="p-2 border rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        {/* 📅 END DATE */}
        <input
          type="date"
          className="p-2 border rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        {/* 🔄 RESET BUTTON */}
        <button
          onClick={() => {
            setSearchTerm("");
            setTypeFilter("ALL");
            setStartDate("");
            setEndDate("");
          }}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Reset
        </button>

      </div>

      {/* ================= SUMMARY ================= */}

      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </div>

      {/* ================= TABLE ================= */}

      {loading && <p>Loading...</p>}

      {!loading && (
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">

          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">User</th>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.map((tx, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">

                <td className="p-3">{tx.name}</td>

                {/* TYPE BADGE */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${tx.type === "RENTAL" && "bg-blue-100 text-blue-600"}
                      ${tx.type === "FINE" && "bg-red-100 text-red-600"}
                      ${tx.type === "RECHARGE" && "bg-green-100 text-green-600"}
                      ${tx.type === "DEPOSIT" && "bg-indigo-100 text-indigo-600"}
                      ${tx.type === "DEPOSIT_REFUND" && "bg-yellow-100 text-yellow-600"}
                    `}
                  >
                    {tx.type}
                  </span>
                </td>

                {/* AMOUNT COLOR BASED ON TYPE */}
                <td
                  className={`p-3 font-semibold
                    ${(tx.type === "RENTAL" || tx.type === "FINE")
                      ? "text-red-600"
                      : "text-green-600"}
                  `}
                >
                  {(tx.type === "RENTAL" || tx.type === "FINE") ? "-" : "+"}
                  ₹{tx.amount}
                </td>

                <td className="p-3">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      )}

    </div>
    </main>
  );
};

export default AdminPaymentHistory;