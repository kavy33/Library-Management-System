import PDFDocument from "pdfkit";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { Borrow } from "../models/borrowModel.js";

export const getAdminReport = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBorrowed = await Borrow.countDocuments({ returnDate: null });
    const overdueBooks = await Borrow.countDocuments({
      dueDate: { $lt: new Date() },
      returnDate: null,
    });

    const revenueData = await Borrow.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    res.status(200).json({
      success: true,
      report: {
        totalBooks,
        totalUsers,
        totalBorrowed,
        overdueBooks,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating report" });
  }
};

export const downloadReportPDF = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalBorrowed = await Borrow.countDocuments({ returnDate: null });

    const revenueData = await Borrow.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=BookWorm_Library_Report.pdf"
    );

    doc.pipe(res);

    // 🔵 HEADER
    doc
      .fillColor("#0f172a")
      .fontSize(22)
      .text("BookWorm Library", { align: "center" });

    doc.moveDown(0.5);

    doc
      .fillColor("#334155")
      .fontSize(16)
      .text("Administrative Report", { align: "center" });

    doc.moveDown(1);

    doc
      .strokeColor("#cbd5e1")
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();

    doc.moveDown(1);

    // 📅 Generated Date
    doc
      .fillColor("black")
      .fontSize(12)
      .text(`Generated On: ${new Date().toDateString()}`);

    doc.moveDown(2);

    // 📊 REPORT SECTION
    doc
      .fontSize(14)
      .fillColor("#1e293b")
      .text("Library Statistics", { underline: true });

    doc.moveDown(1);

    const addStat = (label, value) => {
      doc
        .fontSize(12)
        .fillColor("black")
        .text(label, { continued: true })
        .fillColor("#0f172a")
        .text(` ${value}`);
      doc.moveDown(0.8);
    };

    addStat("Total Books:", totalBooks);
    addStat("Total Users:", totalUsers);
    addStat("Currently Borrowed:", totalBorrowed);
    addStat("Total Revenue:", `₹${totalRevenue}`);

    doc.moveDown(3);

    // 🔵 FOOTER
    doc
      .fontSize(10)
      .fillColor("gray")
      .text(
        "This is a system-generated report from BookWorm Library Management System.",
        50,
        750,
        { align: "center" }
      );

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Error generating report" });
  }
};