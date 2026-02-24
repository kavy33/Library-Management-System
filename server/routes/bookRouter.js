import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { addBook, deleteBook, getAllBook, updateBook } from "../controllers/bookController.js";
import express from "express";
const router = express.Router(); 

router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);
router.get("/all",getAllBook);
router.delete("/admin/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook);
router.put("/admin/update/:id", isAuthenticated, isAuthorized("Admin"), updateBook);


// router.get("/all", isAuthenticated, getAllBook);





export default router;
