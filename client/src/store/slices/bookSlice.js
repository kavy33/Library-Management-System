import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleAddBookPopup } from "./popUpSlice";
import { toast } from "react-toastify";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    loading: false,
    error: null,
    message: null,
    books: [],
  },
  reducers: {
    // ===== COMMON =====
    setBooks(state, action) {
      state.loading = false;
      state.books = action.payload;
    },
    setMessage(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    setError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetBookSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },

    // ===== LOADING =====
    fetchBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
  },
});


// ================= THUNKS =================

// 🔹 FETCH ALL BOOKS (ADMIN)
export const fetchAllBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.fetchBookRequest());
  try {
    const { data } = await axios.get(
      "http://localhost:4000/api/v1/book/all",
      { withCredentials: true }
    );
    dispatch(bookSlice.actions.setBooks(data.books));
  } catch (err) {
    dispatch(
      bookSlice.actions.setError(
        err.response?.data?.message || "Failed to fetch books"
      )
    );
  }
};

// 🔹 ADD BOOK
export const addBook = (data) => async (dispatch) => {
  dispatch(bookSlice.actions.addBookRequest());
  try {
    const { data: resData } = await axios.post(
      "http://localhost:4000/api/v1/book/admin/add",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    toast.success(resData.message);
    dispatch(bookSlice.actions.setMessage(resData.message));
    dispatch(toggleAddBookPopup());
    dispatch(fetchAllBooks());
  } catch (err) {
    dispatch(
      bookSlice.actions.setError(
        err.response?.data?.message || "Add book failed"
      )
    );
  }
};

// 🔹 DELETE BOOK ✅
export const deleteBook = (id) => async (dispatch) => {
  try {
    const { data } = await axios.delete(
      `http://localhost:4000/api/v1/book/admin/delete/${id}`,
      { withCredentials: true }
    );

    toast.success(data.message);
    dispatch(bookSlice.actions.setMessage(data.message));
    dispatch(fetchAllBooks());
  } catch (err) {
    dispatch(
      bookSlice.actions.setError(
        err.response?.data?.message || "Delete failed"
      )
    );
  }
};

export const { resetBookSlice } = bookSlice.actions;
export default bookSlice.reducer;
