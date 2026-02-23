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

export const downloadAdminReportPDF = async (req, res) => {
  try {
    // 🔥 Generate report data (same as getAdminReport)
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

    const report = {
      totalBooks,
      totalUsers,
      totalBorrowed,
      overdueBooks,
      totalRevenue,
    };

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=BookWorm_Library_Report.pdf"
    );

    doc.pipe(res);

    /* ---------- HEADER ---------- */
    doc
      .fontSize(24)
      .fillColor("#111827")
      .text("BookWorm Library", { align: "center" });

    doc
      .moveDown(0.5)
      .fontSize(14)
      .fillColor("gray")
      .text("Administrative Report", { align: "center" });

    doc.moveDown(1);

    doc
      .fontSize(10)
      .fillColor("black")
      .text(`Generated On: ${new Date().toDateString()}`, {
        align: "right",
      });

    doc.moveDown(1);

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    doc.moveDown(1.5);

    /* ---------- STATISTICS ---------- */
    doc.fontSize(16).text("Library Statistics", { underline: true });

    doc.moveDown(1);

    doc.fontSize(12).text(`Total Books: ${report.totalBooks}`);
    doc.moveDown(0.5);
    doc.text(`Total Users: ${report.totalUsers}`);
    doc.moveDown(0.5);
    doc.text(`Currently Borrowed: ${report.totalBorrowed}`);
    doc.moveDown(0.5);
    doc.text(`Overdue Books: ${report.overdueBooks}`);
    doc.moveDown(0.5);
    doc.text(`Total Revenue: ₹${report.totalRevenue}`);

    doc.moveDown(3);

    doc
      .fontSize(10)
      .fillColor("gray")
      .text("© 2026 BookWorm Library. All rights reserved.", {
        align: "center",
      });

    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating PDF report",
    });
  }
};