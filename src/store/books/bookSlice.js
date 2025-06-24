import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../../service/bookService";

// Initial state for books slice
const initialState = {
  books: [],
  status: "idle",
  error: null,
};

// Async thunk to fetch books
export const fetchAllBookAsync = createAsyncThunk("/fetchBook", async () => {
  const response = await fetchAllBooks();
  return response.data;
});

// Async thunk to create a book
export const createBookAsync = createAsyncThunk(
  "/createBook",
  async (userData) => {
    const response = await createBook(userData);
    return response.data;
  }
);

// Async thunk to update a book
export const updateBookAsync = createAsyncThunk(
  "/updateBook",
  async ({ id, ...bookData }) => {
    const response = await updateBook({ id, bookData });
    return response.data;
  }
);

// Async thunk to delete a book
export const deleteBookAsync = createAsyncThunk("/deleteBook", async (id) => {
  await deleteBook(id);
  return id;
});

export const updateBookCollaboratorsAsync = createAsyncThunk(
  "books/updateCollaborators",
  async ({ bookId, collaborators }, { getState, rejectWithValue }) => {
    try {
      // Get the current book from state
      const state = getState();
      const book = state.book.books.find((b) => b.id === bookId);
      if (!book) throw new Error("Book not found");

      // Send the full book object with updated collaborators
      const updatedBook = { ...book, collaborators };
      const response = await updateBook({ id: bookId, bookData: updatedBook });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    updateBookCollaborators: (state, action) => {
      const { bookId, collaborators } = action.payload;
      const book = state.books.find((b) => b.id === bookId);
      if (book) {
        book.collaborators = collaborators;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBookAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllBookAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books = action.payload;
      })
      .addCase(fetchAllBookAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createBookAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createBookAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books.push(action.payload);
      })
      .addCase(createBookAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateBookAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateBookAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Update the book in state based on action.payload
        const updatedBookIndex = state.books.findIndex(
          (book) => book.id === action.payload.id
        );
        if (updatedBookIndex !== -1) {
          state.books[updatedBookIndex] = action.payload;
        }
      })
      .addCase(updateBookAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteBookAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteBookAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books = state.books.filter((book) => book.id !== action.payload);
      })
      .addCase(deleteBookAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateBookCollaboratorsAsync.fulfilled, (state, action) => {
        const updatedBookIndex = state.books.findIndex(
          (book) => book.id === action.payload.id
        );
        if (updatedBookIndex !== -1) {
          state.books[updatedBookIndex] = action.payload;
        }
      });
  },
});

export const { updateBookCollaborators } = bookSlice.actions;

export default bookSlice.reducer;
