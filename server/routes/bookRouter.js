import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { addBook, addReview, deleteBook, deleteReview, getAllBook, getBookReviews, updateBook } from "../controllers/bookController.js";

import express from "express";
const router = express.Router(); 

router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);
router.get("/all",getAllBook);
router.delete("/admin/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook);
router.put("/admin/update/:id", isAuthenticated, isAuthorized("Admin"), updateBook);
router.put("/review/:id", isAuthenticated, addReview);
router.get("/review/:id",getBookReviews);
router.delete("/review/:bookId/:reviewId",isAuthenticated,isAuthorized("Admin"),deleteReview);



// router.get("/all", isAuthenticated, getAllBook);





export default router;
