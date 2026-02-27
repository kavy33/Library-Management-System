import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import cloudinary from "../config/cloudinary.js";


export const addBook = catchAsyncErrors(async (req, res, next) => {
    const { title, author, description, price, quantity, category } = req.body;


    if (!title || !author || !description || !price || !quantity || !category) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // 🔥 Prevent duplicate books (safe check)
    const existingBook = await Book.findOne({ 
        title: { $regex: `^${title}$`, $options: "i" },
         author: { $regex: `^${author}$`, $options: "i" },
    });

    if (existingBook) {
        return next(new ErrorHandler("Duplicate book entry not allowed", 400));
    }
let imageData = {};

if (req.files && req.files.image) {
  const file = req.files.image;

  const result = await cloudinary.uploader.upload(
    file.tempFilePath,
    {
      folder: "library_books"
    }
  );

  imageData = {
    public_id: result.public_id,
    url: result.secure_url
  };
}

    const book = await Book.create({
  title,
  author,
  description,
  price,
  quantity,
  category,
  image: imageData
});

    res.status(201).json({
        success: true,
        message: "Book added successfully",
        book,
    });
});



export const getAllBook = catchAsyncErrors(async (req, res, next) => {
    const books = await Book.find({});
    // if(!books || books.length === 0){
    //     return next(new ErrorHandler("No books found", 404));
    // }
    res.status(200).json({
        success: true,
        count:books.length,
        books,
    });
});
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
        return next(new ErrorHandler("Book not found", 404));
    }
//cloudinary image deletion
    if (book.image?.public_id) {
  await cloudinary.uploader.destroy(book.image.public_id);
}
//

    await Book.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
    });
});

//Update book details (Admin)

export const updateBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title, author, description, price, quantity, category } = req.body;

  const book = await Book.findById(id);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  // 🔥 Prevent duplicate (except current book)
  const duplicateBook = await Book.findOne({
    title,
    author,
    _id: { $ne: id },
  });

  if (duplicateBook) {
    return next(new ErrorHandler("Duplicate book entry not allowed", 400));
  }

  let imageData = book.image; // keep old image by default

  // 🔥 If new image uploaded
  if (req.files && req.files.image) {
    // delete old image
    if (book.image?.public_id) {
      await cloudinary.uploader.destroy(book.image.public_id);
    }

    const file = req.files.image;

    const result = await cloudinary.uploader.upload(
      file.tempFilePath,
      { folder: "library_books" }
    );

    imageData = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  // 🔥 Update book
  book.title = title || book.title;
  book.author = author || book.author;
  book.description = description || book.description;
  book.price = price || book.price;
  book.quantity = quantity || book.quantity;
  book.category = category || book.category;
  book.image = imageData;

  await book.save();

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    book,
  });
});

export const addReview = catchAsyncErrors(async (req, res, next) => {
  let { rating, comment } = req.body;
  rating = Math.min(Math.max(Number(rating), 1), 5);

 

  const book = await Book.findById(req.params.id);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  const alreadyReviewed = book.ratings.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    alreadyReviewed.rating = Math.min(Math.max(rating, 1), 5); // ensure rating stays between 1 and 5
    alreadyReviewed.comment = comment;
  } else {
    book.ratings.push({
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      rating: Math.min(Math.max(rating, 1), 5), // ensure rating stays between 1 and 5
      comment,
      verifiedBorrow: true,
    });
  }

  book.numReviews = book.ratings.length;

  const total = book.ratings.reduce((acc, item) => {
  const safeRating = Math.min(Math.max(item.rating, 1), 5);
  return acc + safeRating;
}, 0);

book.averageRating =
  book.ratings.length > 0
    ? total / book.ratings.length
    : 0;

  await book.save();

  res.status(200).json({
    success: true,
    message: "Review submitted successfully",
  });
});
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const { bookId, reviewId } = req.params;
  const book = await Book.findById(bookId);

  

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  // Filter out the review
  const updatedRatings = book.ratings.filter(
    (review) => review._id.toString() !== reviewId
  );

  book.ratings = updatedRatings;
  book.numReviews = updatedRatings.length;

  book.averageRating =
    updatedRatings.length === 0
      ? 0
      : updatedRatings.reduce((acc, item) => acc + item.rating, 0) /
        updatedRatings.length;

  await book.save();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
export const getBookReviews = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  res.status(200).json({
    success: true,
    book,
  });
});

