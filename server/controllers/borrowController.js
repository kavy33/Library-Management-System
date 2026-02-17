import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";

/**
 * 📕 BORROW / GET BOOK
 */
export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id: bookId } = req.params;
  const userId = req.user._id; // ✅ secure user

  // 🔍 Find book
  const book = await Book.findById(bookId);
  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  // 🔍 Find user
  const user = await User.findById(userId);
  if (!user || !user.accountVerified) {
    return next(new ErrorHandler("User not verified.", 403));
  }

  // 🔐 Deposit check
  if (!user.depositPaid) {
    return next(
      new ErrorHandler(
        "Please pay ₹1000 security deposit before borrowing books.",
        403
      )
    );
  }

  // 🚫 Max 3 books limit
  if (user.rentedBooks.length >= 3) {
    return next(
      new ErrorHandler("You can borrow only 3 books at a time.", 400)
    );
  }

  // 🚫 Already borrowed check
  const alreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() === bookId && b.returned === false
  );
  if (alreadyBorrowed) {
    return next(new ErrorHandler("Book already borrowed.", 400));
  }

  // 📦 Stock check
//   if (book.quantity === 0) {
//     return next(new ErrorHandler("Book is currently unavailable.", 400));
//   }

  // 📉 Update book stock
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  const borrowedDate = new Date();
  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // 🧾 Create borrow record
  const borrowRecord = await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    book: book._id,
    borrowedDate,
    dueDate,
    price: book.price,
  });

  // 👤 Update user
  user.borrowedBooks.push({
    bookId: book._id,
    bookTitle: book.title,
    borrowedDate,
    dueDate,
    returned: false,
  });

  user.rentedBooks.push(book._id);
  await user.save();

  res.status(201).json({
    success: true,
    message: "Book borrowed successfully.",
  });
});

/**
 * 📗 RETURN BOOK
 */
export const returnBorrowBook = catchAsyncErrors(async (req, res, next) => {
  const { borrowId } = req.params;

  // 🔍 Find borrow record first
  const borrow = await Borrow.findById(borrowId);

  if (!borrow) {
    return next(new ErrorHandler("Borrow record not found.", 404));
  }

  if (borrow.returnDate) {
    return next(new ErrorHandler("Book already returned.", 400));
  }

  // 🔍 Find book
  // 🔍 Find book
const book = await Book.findById(borrow.book);

if (!book) {
  // Book was deleted but borrow record exists
  borrow.returnDate = new Date();
  borrow.fine = calculateFine(borrow.dueDate);
  await borrow.save();

  return res.status(200).json({
    success: true,
    message: "Book returned (original book record was removed).",
  });
}


  // 🔍 Find actual user who borrowed
  const user = await User.findById(borrow.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // 🔍 Find borrowed book in user document
  const borrowedBook = user.borrowedBooks.find(
    (b) =>
      b.bookId.toString() === book._id.toString() &&
      b.returned === false
  );

  if (!borrowedBook) {
    return next(new ErrorHandler("This book was not borrowed.", 400));
  }

  // ✅ Mark returned in user
  borrowedBook.returned = true;

  // 🧹 Remove from rentedBooks
  user.rentedBooks = user.rentedBooks.filter(
    (id) => id.toString() !== book._id.toString()
  );

  await user.save();

  // 📈 Increase stock
  book.quantity += 1;
  book.availability = true;
  await book.save();

  // 💰 Calculate fine
  borrow.returnDate = new Date();
  const fine = calculateFine(borrow.dueDate);
  borrow.fine = fine;

  await borrow.save();

  res.status(200).json({
    success: true,
    message:
      fine > 0
        ? `Book returned successfully. Total charge: ₹${fine + book.price}`
        : `Book returned successfully. Total charge: ₹${book.price}`,
    fine,
  });
});


/**
 * 📚 USER → MY BORROWED BOOKS
 */
export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    borrowedBooks: req.user.borrowedBooks || [],
  });
});

/**
 * 🛠 ADMIN → ALL BORROWED BOOKS
 */
export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
  const borrowedBooks = await Borrow.find();
  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});
