import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Books() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // 🔐 AUTH CHECK
  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }
    fetchBooks();
  }, [token]);

  // 📚 FETCH BOOKS
  const fetchBooks = async () => {
    try {
      const res = await api.get("/books", {
        headers: { Authorization: token }
      });

      setBooks(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // ➕ ADD BOOK
  const addBook = async () => {
    if (!title) return;

    try {
      await api.post(
        "/books",
        { title },
        { headers: { Authorization: token } }
      );

      setTitle("");
      fetchBooks();
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // 🗑 DELETE BOOK
  const deleteBook = async (id) => {
    try {
      await api.delete(`/books/${id}`, {
        headers: { Authorization: token }
      });

      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  // ✏️ START EDIT
  const startEdit = (book) => {
    setTitle(book.title);
    setEditId(book._id);
  };

  // ✏️ UPDATE BOOK
  const updateBook = async () => {
    try {
      await api.put(
        `/books/${editId}`,
        { title },
        { headers: { Authorization: token } }
      );

      setTitle("");
      setEditId(null);
      fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = () => {
    editId ? updateBook() : addBook();
  };

  return (
    <div style={{ padding: "20px" }}>

      {/* ✅ NAVBAR ADDED HERE */}
      <Navbar />

      <h2>My Books</h2>

      {/* 🔎 SEARCH + FILTER */}
      <div style={{ marginTop: "10px" }}>
        <input
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Want to Read</option>
          <option>Reading</option>
          <option>Finished</option>
        </select>
      </div>

      {/* ➕ ADD / EDIT */}
      <div style={{ marginTop: "10px" }}>
        <input
          placeholder="Book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* 📭 EMPTY STATE */}
      {books.length === 0 && (
        <p style={{ marginTop: "20px" }}>
          You haven't added any books yet! Click the button below to start your library.
        </p>
      )}

      {/* 📚 GRID LAYOUT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        {books
          .filter((b) => {
            const matchSearch = b.title
              .toLowerCase()
              .includes(search.toLowerCase());

            const matchStatus =
              statusFilter === "All"
                ? true
                : b.status === statusFilter;

            return matchSearch && matchStatus;
          })
          .map((b) => {
            const progress =
              b.pagesTotal > 0
                ? (b.pagesRead / b.pagesTotal) * 100
                : 0;

            return (
              <div
                key={b._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "8px"
                }}
              >
                <div>
                  <strong>{b.title}</strong> - {b.status}
                </div>

                <div>
                  Progress: {b.pagesRead || 0}/{b.pagesTotal || 0}
                </div>

                {/* PROGRESS BAR */}
                <div
                  style={{
                    width: "100%",
                    background: "#ddd",
                    height: "10px",
                    borderRadius: "5px",
                    marginTop: "5px"
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      background: "green",
                      height: "10px",
                      borderRadius: "5px"
                    }}
                  />
                </div>

                {/* ACTIONS */}
                <button onClick={() => startEdit(b)}>Edit</button>
                <button onClick={() => deleteBook(b._id)}>Delete</button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Books;