import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const styles = {
  container: { maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", fontFamily: "'Inter', sans-serif", backgroundColor: "#f8f9fa" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" },
  statCard: { background: "white", padding: "20px", borderRadius: "12px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" },
  
  toggleContainer: { display: "flex", justifyContent: "flex-end", marginBottom: "20px" },
  formCard: { background: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: "40px" },
  formRow1: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "15px", marginBottom: "15px" },
  formRow2: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "15px" },
  
  input: { padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" },
  textarea: { width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ddd", minHeight: "100px", marginBottom: "15px", boxSizing: "border-box", resize: "vertical" },
  primaryBtn: { backgroundColor: "#007bff", color: "white", border: "none", padding: "12px 24px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  secondaryBtn: { backgroundColor: "transparent", color: "#666", border: "1px solid #ddd", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" },
  
  quickBtn: { padding: "2px 8px", fontSize: "16px", cursor: "pointer", border: "1px solid #ddd", borderRadius: "4px", background: "#eee", margin: "0 5px" },
  
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" },
  // FIXED: Reduced height to 400px
  bookCard: { background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #eee", overflow: "hidden", display: "flex", flexDirection: "column", height: "400px" }, 
  cardContent: { padding: "20px", flexGrow: 1, display: "flex", flexDirection: "column" },
  cardActionArea: { backgroundColor: "#f9f9f9", padding: "12px 20px", borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" },
  
  badge: (status) => ({
    display: "inline-block", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", 
    backgroundColor: status === "Finished" ? "#d4edda" : status === "Reading" ? "#fff3cd" : "#e2e3e5",
    color: status === "Finished" ? "#155724" : status === "Reading" ? "#856404" : "#383d41", marginBottom: "10px"
  }),
  progressBarContainer: { background: "#eee", height: "8px", borderRadius: "4px", margin: "10px 0", overflow: "hidden" },
  progressBar: (width) => ({ width: `${width}%`, background: "#28a745", height: "100%", transition: "width 0.5s ease" }),
  
  toast: {
    position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
    backgroundColor: "#333", color: "white", padding: "12px 24px", borderRadius: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)", zIndex: 1000, fontSize: "14px", fontWeight: "500"
  },
  

  noteBox: { 
    fontSize: "13px", color: "#555", fontStyle: "italic", marginTop: "15px", padding: "8px 12px", 
    backgroundColor: "#fcfcfc", borderLeft: "3px solid #007bff", borderRadius: "4px",
    height: "60px", overflowY: "auto", wordBreak: "break-all", whiteSpace: "pre-wrap"
  },

  paginationRow: { display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginTop: "30px" }
};

function Books() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6; 

  const emptyForm = { title: "", author: "", status: "Want to Read", pagesTotal: "", pagesRead: "", notes: "" };
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("newest"); 
  const [editId, setEditId] = useState(null);
  const [notification, setNotification] = useState("");

  const token = localStorage.getItem("token");

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  useEffect(() => {
    if (!token) { window.location.href = "/"; return; }
    fetchBooks();
  }, [token]);

  const fetchBooks = async () => {
    try {

      const res = await api.get("/books", { headers: { Authorization: token } });
      setBooks(res.data);
    } catch (err) { console.error("Fetch error:", err); }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (parseInt(form.pagesRead) > parseInt(form.pagesTotal)) {
      showToast("Current page cannot exceed total!");
      return;
    }
    try {
      if (editId) {
        await api.put(`/books/${editId}`, form, { headers: { Authorization: token } });
        showToast(" Changes saved!");
        setEditId(null);
      } else {
        await api.post("/books", form, { headers: { Authorization: token } });
        showToast("Book added!");
      }
      setForm(emptyForm);
      setShowForm(false);
      fetchBooks();
    } catch (err) { showToast("Error saving book"); }
  };

  const updateProgress = async (book, amount) => {
    const newPage = Math.min(Math.max(book.pagesRead + amount, 0), book.pagesTotal);
    try {
      await api.put(`/books/${book._id}`, { ...book, pagesRead: newPage }, { headers: { Authorization: token } });
      fetchBooks();
    } catch (err) { console.error(err); }
  };

  const deleteBook = async (id) => {
    if (window.confirm("Delete this book?")) {
      await api.delete(`/books/${id}`, { headers: { Authorization: token } });
      showToast("Book deleted");
      fetchBooks();
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowForm(false);
  };

 
  const processedBooks = books
    .filter(b => (
      b.title.toLowerCase().includes(search.toLowerCase()) || 
      b.author.toLowerCase().includes(search.toLowerCase())
    ) && (statusFilter === "All Status" || b.status === statusFilter))
    .sort((a, b) => {
       if (sortBy === "progress") return (b.pagesRead / b.pagesTotal) - (a.pagesRead / a.pagesTotal);
       return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const totalPages = Math.ceil(processedBooks.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = processedBooks.slice(indexOfFirstBook, indexOfLastBook);

  const onFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div style={styles.container}>
      <Navbar />
      
      {notification && <div style={styles.toast}>{notification}</div>}

      <div style={styles.statsRow}>
        <div style={styles.statCard}><h3>{books.length}</h3><p>Total Books</p></div>
        <div style={styles.statCard}><h3>{books.filter(b => b.status === "Reading").length}</h3><p>Reading</p></div>
        <div style={styles.statCard}><h3>{books.filter(b => b.status === "Finished").length}</h3><p>Finished</p></div>
      </div>

      <div style={styles.header}>
        <h1 style={{ color: "#333", margin: 0 }}>My Library</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <input 
            style={styles.input} 
            placeholder="Search title or author..." 
            value={search} 
            onChange={onFilterChange(setSearch)} 
          />
          <select style={styles.input} value={statusFilter} onChange={onFilterChange(setStatusFilter)}>
            <option>All Status</option>
            <option>Want to Read</option>
            <option>Reading</option>
            <option>Finished</option>
          </select>
          <select style={styles.input} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="progress">Most Progress</option>
          </select>
        </div>
      </div>

      <div style={styles.toggleContainer}>
        <button 
          style={{...styles.primaryBtn, backgroundColor: showForm ? "#6c757d" : "#007bff"}} 
          onClick={() => { 
            if (showForm) { handleCancel(); } 
            else { setShowForm(true); setForm(emptyForm); } 
          }}
        >
          {showForm ? "✕ Close" : "+ Add New Book"}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3 style={{ marginTop: 0 }}>{editId ? "Edit Details" : "Add New Entry"}</h3>
          <div style={styles.formRow1}>
            <input name="title" style={styles.input} placeholder="Title" value={form.title} onChange={handleChange} />
            <input name="author" style={styles.input} placeholder="Author" value={form.author} onChange={handleChange} />
          </div>
          <div style={styles.formRow2}>
            <select name="status" style={styles.input} value={form.status} onChange={handleChange}>
              <option>Want to Read</option>
              <option>Reading</option>
              <option>Finished</option>
            </select>
            <input name="pagesTotal" type="number" style={styles.input} placeholder="Total Pages" value={form.pagesTotal} onChange={handleChange} />
            <input name="pagesRead" type="number" style={styles.input} placeholder="Pages Read" value={form.pagesRead} onChange={handleChange} />
          </div>
          <textarea name="notes" style={styles.textarea} placeholder="Notes..." value={form.notes} onChange={handleChange} />
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={styles.primaryBtn} onClick={handleSubmit}>{editId ? "Update" : "Add Book"}</button>
            <button style={styles.secondaryBtn} onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}

      <div style={styles.grid}>
        {currentBooks.length > 0 ? (
          currentBooks.map((b) => {
            const progress = b.pagesTotal > 0 ? (b.pagesRead / b.pagesTotal) * 100 : 0;
            return (
              <div key={b._id} style={styles.bookCard}>
                <div style={styles.cardContent}>
                  <span style={styles.badge(b.status)}>{b.status}</span>
                  <h3 style={{ margin: "5px 0", fontSize: "16px" }}>{b.title}</h3>
                  <p style={{ color: "#666", fontSize: "13px" }}>by {b.author}</p>
                  
                  <div style={{ marginTop: "10px" }}>
                    <span style={{ fontSize: "11px", color: "#888" }}>PROGRESS: {Math.round(progress)}%</span>
                    <div style={styles.progressBarContainer}><div style={styles.progressBar(progress)} /></div>
                    <p style={{ fontSize: "12px", margin: 0 }}>{b.pagesRead} / {b.pagesTotal} pages</p>
                  </div>

                  <div style={styles.noteBox}>
                    {b.notes ? `"${b.notes}"` : "No notes added."}
                  </div>

                  <div style={{ display: "flex", marginTop: "auto", gap: "10px" }}>
                    <button style={{...styles.secondaryBtn, padding: "4px 12px", fontSize: "11px"}} onClick={() => { setEditId(b._id); setForm(b); setShowForm(true); window.scrollTo(0,0); }}>Edit</button>
                    <button style={{...styles.secondaryBtn, padding: "4px 12px", fontSize: "11px", color: "red"}} onClick={() => deleteBook(b._id)}>Delete</button>
                  </div>
                </div>

                <div style={styles.cardActionArea}>
                   <span style={{fontSize: "12px", color: "#777"}}>Adjust:</span>
                   <div>
                      <button style={styles.quickBtn} onClick={() => updateProgress(b, -1)}>-</button>
                      <button style={styles.quickBtn} onClick={() => updateProgress(b, 1)}>+</button>
                   </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#888" }}>
            <p style={{fontSize: "24px"}}></p>
            <p>{search ? "No matches found." : "Your library is empty."}</p>
          </div>
        )}
      </div>

      {}
      {totalPages > 1 && (
        <div style={styles.paginationRow}>
          <button 
            disabled={currentPage === 1}
            style={{...styles.secondaryBtn, opacity: currentPage === 1 ? 0.5 : 1}}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span style={{ fontSize: "14px", fontWeight: "600" }}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages}
            style={{...styles.secondaryBtn, opacity: currentPage === totalPages ? 0.5 : 1}}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Books;