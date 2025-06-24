import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBookAsync, createBookAsync, updateBookAsync, deleteBookAsync } from "../store/books/bookSlice";
import { useEffect } from "react";
import Header from "../components/Header";
import { Modal, message, Tag, Button } from "antd";
import { PlusOutlined, UserOutlined, CalendarOutlined, BookOutlined } from "@ant-design/icons";
import BookCard from "../components/Books/book-card";
import { useNavigate } from "react-router-dom";
import { AddBookModal, EditBookModal } from "../components/Books/BookModals";
import PrimaryButton from "../components/Common/PrimaryButton";
import { getUserRole, isAuthor, isCollaborator } from "../utils/permissions";

export default function Dashboard() {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.book.books);
  const user = useSelector((state) => state.user.user); // Adjust if your user state is different
  const userRole = getUserRole(useSelector((state) => state.user));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [inputError, setInputError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [showRoleTest, setShowRoleTest] = useState(false);
  const navigate = useNavigate();

  // Filter books based on role
  const userEmail = user?.email;
  const userName = user?.name;
  const visibleBooks = books
    .filter(book => book.title) // Only show books with a title
    .filter(book => {
      if (isAuthor(userRole)) {
        // Show books where the user is the author (by name or email)
        return book.author === userName || book.author === userEmail;
      } else if (isCollaborator(userRole)) {
        // Show books where the user is a collaborator
        return Array.isArray(book.collaborators) && book.collaborators.includes(userEmail);
      }
      return false;
    });

  useEffect(() => {
    dispatch(fetchAllBookAsync()).finally(() => setLoading(false));
  }, [dispatch]);

  const handleCreateBook = async () => {
    if (!newBookTitle.trim()) {
      setInputError("Book title is required");
      return;
    }
    setInputError("");
    setModalLoading(true);
    await dispatch(createBookAsync({
      title: newBookTitle,
      author: user?.email || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      collaborators: [],
    }));
    // Fetch all books again to ensure state is up-to-date
    await dispatch(fetchAllBookAsync());
    setNewBookTitle("");
    setIsModalOpen(false);
    setModalLoading(false);
    message.success("Book created successfully!");
  };

  const handleOpenBook = (id) => {
    navigate(`/books/${id}`);
  };

  const handleEditBook = (book) => {
    if (!isAuthor(userRole)) {
      message.error("You do not have permission to edit this book.");
      return;
    }
    setSelectedBook(book);
    setEditTitle(book.title);
    setEditModalOpen(true);
  };

  const handleEditBookSave = async () => {
    if (!editTitle.trim()) {
      message.error("Book title is required");
      return;
    }
    setModalLoading(true);
    await dispatch(updateBookAsync({ id: selectedBook.id, title: editTitle, updatedAt: new Date().toISOString() }));
    setEditModalOpen(false);
    setSelectedBook(null);
    setEditTitle("");
    setModalLoading(false);
    message.success("Book updated successfully!");
  };

  const handleDeleteBook = (book) => {
    Modal.confirm({
      title: `Delete "${book.title}"?`,
      content: "Are you sure you want to delete this book? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await dispatch(deleteBookAsync(book.id));
        message.success("Book deleted successfully!");
      },
    });
  };

  // Get role display info
  const getRoleDisplay = () => {
    if (isAuthor(userRole)) {
      return { text: "Author", color: "blue" };
    } else if (isCollaborator(userRole)) {
      return { text: "Collaborator", color: "green" };
    }
    return { text: "Unknown", color: "default" };
  };

  const roleDisplay = getRoleDisplay();

  return (
    <div className=" bg-gray-50">
      {/* Header */}
        <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-gray-900">Your Books</h2>
              <Tag color={roleDisplay.color} className="text-sm font-medium">
                {roleDisplay.text}
              </Tag>
            </div>
            <p className="text-gray-600 mt-2">
              {isAuthor(userRole) 
                ? "Create and manage your book projects. You can create, edit, and delete sections." 
                : "View and edit book content. You can only edit section content, not create or delete sections."
              }
            </p>
          </div>
          <div className="flex gap-2">
            {isAuthor(userRole) && (
              <PrimaryButton className="flex items-center" onClick={() => setIsModalOpen(true)} icon={<PlusOutlined /> }>
                New Book
              </PrimaryButton>
            )}
          </div>
        </div>

        {/* Add Book Modal */}
        <AddBookModal
          open={isModalOpen}
          onCancel={() => { setIsModalOpen(false); setInputError(""); }}
          onOk={handleCreateBook}
          inputValue={newBookTitle}
          onInputChange={e => { setNewBookTitle(e.target.value); setInputError(""); }}
          error={inputError}
          loading={modalLoading}
        />

        {/* Edit Book Modal */}
        <EditBookModal
          open={editModalOpen}
          onCancel={() => { setEditModalOpen(false); setSelectedBook(null); setEditTitle(""); }}
          onOk={handleEditBookSave}
          inputValue={editTitle}
          onInputChange={e => setEditTitle(e.target.value)}
          loading={modalLoading}
        />

        {/* Books Grid */}
        {loading ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <BookOutlined className="text-blue-600 animate-spin text-4xl mr-2" />
            <span>Loading your books...</span>
          </div>
        ) : visibleBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOutlined className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No books yet</h3>
            <p className="text-gray-600 mb-6">Create your first book to get started</p>
            {isAuthor(userRole) && (
              <PrimaryButton onClick={() => setIsModalOpen(true)} icon={<PlusOutlined />}>
                Create Your First Book
              </PrimaryButton>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onOpen={handleOpenBook}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
                isAuthor={isAuthor(userRole)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
