import axios from "../config/Axios";

// Fetch all books
export const fetchAllBooks = () => {
  return axios.get("/books");
};

// Create a new book
export const createBook = async (bookData) => {
  return await axios.post("/books", bookData);
};

// Update a book by ID
export const updateBook = ({ id, bookData }) => {
  return axios.put(`/books/${id}`, bookData);
};

// Delete a book by ID
export const deleteBook = (id) => {
  return axios.delete(`/books/${id}`);
};
