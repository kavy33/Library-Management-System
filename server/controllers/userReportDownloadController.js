import PDFDocument from "pdfkit";
import { User } from "../models/userModel.js";

export const downloadUserReport = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const doc = new PDFDocument({ margin: 60, size: "A4" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=BookWorm_Analytics_Report.pdf"
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    /* ===============================
          HEADER
    =============================== */

    doc
      .fontSize(24)
      .fillColor("#111827")
      .text("BookWorm Library", { align: "center" });

    doc
      .fontSize(14)
      .fillColor("gray")
      .text("User Analytics Report", { align: "center" });

    doc.moveDown(1.5);

    doc
      .strokeColor("#2563eb")
      .lineWidth(2)
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke();

    doc.moveDown(2);

    /* ===============================
          USER INFO
    =============================== */

    doc
      .fontSize(16)
      .fillColor("#2563eb")
      .text("User Information");

    doc.moveDown(1);

    doc.fontSize(13).fillColor("black");

    doc.text(`Name: ${user.name}`);
    doc.text(`Role: ${user.role}`);
    doc.text(`Generated On: ${new Date().toLocaleDateString()}`);

    doc.moveDown(2);

    /* ===============================
          SUMMARY SECTION
    =============================== */

    const totalBorrowed = user.borrowedBooks.length;
    const currentlyBorrowed = user.borrowedBooks.filter(
      (b) => !b.returned
    ).length;

    let totalSpent = 0;
    let totalFines = 0;

    user.wallet.transactions.forEach((tx) => {
      if (tx.type === "RENTAL") totalSpent += tx.amount;
      if (tx.type === "FINE") {
        totalFines += tx.amount;
        totalSpent += tx.amount;
      }
    });

    doc
      .fontSize(16)
      .fillColor("#2563eb")
      .text("Summary Overview");

    doc.moveDown(1.2);

    const summaryData = [
      ["Total Borrowed Books", totalBorrowed],
      ["Currently Borrowed", currentlyBorrowed],
      ["Total Spent", `₹${totalSpent}`],
      ["Total Fines", `₹${totalFines}`],
      ["Current Wallet Balance", `₹${user.wallet.balance}`],
    ];

    summaryData.forEach(([label, value]) => {
      doc
        .fontSize(13)
        .fillColor("#111827")
        .text(label, { continued: true })
        .text(` : ${value}`);
      doc.moveDown(0.8);
    });

    doc.moveDown(3);

    /* ===============================
          FOOTER
    =============================== */

    doc
      .fontSize(10)
      .fillColor("gray")
      .text(
        "© 2026 BookWorm Library | Confidential Report",
        { align: "center" }
      );

    doc.end();

  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to generate report"
      });
    }
  }
};