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
    const existingBook = await Book.findOne({ title, author });

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
