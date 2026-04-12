import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const styles = {
  container: { maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", fontFamily: "'Inter', sans-serif", backgroundColor: "#f8f9fa" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  
  statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" },
  statCard: { background: "white", padding: "20px", borderRadius: "12px", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" },
  
  formCard: { background: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: "40px" },
  inputGroup: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "15px" },
  input: { padding: "12px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "14px", outline: "none" },
  textarea: { width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ddd", minHeight: "80px", marginBottom: "15px" },
  primaryBtn: { backgroundColor: "#007bff", color: "white", border: "none", padding: "12px 24px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  secondaryBtn: { backgroundColor: "transparent", color: "#666", border: "1px solid #ddd", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", marginRight: "10px" },
  
  quickBtn: { padding: "2px 8px", fontSize: "16px", cursor: "pointer", border: "1px solid #ddd", borderRadius: "4px", background: "#eee", margin: "0 5px" },
  
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" },
  bookCard: { background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #eee", position: "relative" },
  badge: (status) => ({
    display: "inline-block", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", 
    backgroundColor: status === "Finished" ? "#d4edda" : status === "Reading" ? "#fff3cd" : "#e2e3e5",
    color: status === "Finished" ? "#155724" : status === "Reading" ? "#856404" : "#383d41", marginBottom: "10px"
  }),
  progressBarContainer: { background: "#eee", height: "8px", borderRadius: "4px", margin: "15px 0", overflow: "hidden" },
  progressBar: (width) => ({ width: `${width}%`, background: "#28a745", height: "100%", transition: "width 0.5s ease" })
};

function Books() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", status: "Want to Read", pagesTotal: "", pagesRead: "", notes: "" });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("newest"); 
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

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
      alert("Current page cannot be greater than total pages!");
      return;
    }

    try {
      if (editId) {
        await api.put(`/books/${editId}`, form, { headers: { Authorization: token } });
        setEditId(null);
      } else {
        await api.post("/books", form, { headers: { Authorization: token } });
      }
      setForm({ title: "", author: "", status: "Want to Read", pagesTotal: "", pagesRead: "", notes: "" });
      fetchBooks();
    } catch (err) { console.error(err); }
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
      fetchBooks();
    }
  };

  const finishedBooks = books.filter(b => b.status === "Finished").length;
  const readingBooks = books.filter(b => b.status === "Reading").length;

  return (
    <div style={styles.container}>
      <Navbar />
      
      {}
      <div style={styles.statsRow}>
        <div style={styles.statCard}><h3>{books.length}</h3><p>Total Books</p></div>
        <div style={styles.statCard}><h3>{readingBooks}</h3><p>Reading</p></div>
        <div style={styles.statCard}><h3>{finishedBooks}</h3><p>Finished</p></div>
      </div>

      <div style={styles.header}>
        <h1 style={{ color: "#333", margin: 0 }}>My Library</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <input style={styles.input} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select style={styles.input} onChange={(e) => setStatusFilter(e.target.value)}>
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

      <div style={styles.formCard}>
        <h3 style={{ marginTop: 0 }}>{editId ? "Edit Details" : "Add New Entry"}</h3>
        <div style={styles.inputGroup}>
          <input name="title" style={styles.input} placeholder="Title" value={form.title} onChange={handleChange} />
          <input name="author" style={styles.input} placeholder="Author" value={form.author} onChange={handleChange} />
          <select name="status" style={styles.input} value={form.status} onChange={handleChange}>
            <option>Want to Read</option>
            <option>Reading</option>
            <option>Finished</option>
          </select>
          <input name="pagesTotal" type="number" style={styles.input} placeholder="Total Pages" value={form.pagesTotal} onChange={handleChange} />
          <input name="pagesRead" type="number" style={styles.input} placeholder="Pages Read" value={form.pagesRead} onChange={handleChange} />
        </div>
        <textarea name="notes" style={styles.textarea} placeholder="Notes..." value={form.notes} onChange={handleChange} />
        <button style={styles.primaryBtn} onClick={handleSubmit}>{editId ? "Update" : "Add Book"}</button>
        {editId && <button style={styles.secondaryBtn} onClick={() => setEditId(null)}>Cancel</button>}
      </div>

      <div style={styles.grid}>
        {books
          .filter(b => b.title.toLowerCase().includes(search.toLowerCase()) && (statusFilter === "All Status" || b.status === statusFilter))
          .sort((a, b) => {
             if (sortBy === "progress") return (b.pagesRead / b.pagesTotal) - (a.pagesRead / a.pagesTotal);
             return new Date(b.createdAt) - new Date(a.createdAt);
          })
          .map((b) => {
            const progress = b.pagesTotal > 0 ? (b.pagesRead / b.pagesTotal) * 100 : 0;
            return (
              <div key={b._id} style={styles.bookCard}>
                <span style={styles.badge(b.status)}>{b.status}</span>
                <h3 style={{ margin: "5px 0" }}>{b.title}</h3>
                <p style={{ color: "#666", fontSize: "14px" }}>by {b.author}</p>
                
                <div style={{ marginTop: "15px" }}>
                  <span style={{ fontSize: "11px", color: "#888" }}>PROGRESS: {Math.round(progress)}%</span>
                  <div style={styles.progressBarContainer}><div style={styles.progressBar(progress)} /></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "12px", margin: 0 }}>{b.pagesRead} / {b.pagesTotal} pages</p>
                    <div>
                      <button style={styles.quickBtn} onClick={() => updateProgress(b, -1)}>-</button>
                      <button style={styles.quickBtn} onClick={() => updateProgress(b, 1)}>+</button>
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "13px", color: "#555", marginTop: "10px" }}>
                    Added: {new Date(b.createdAt).toLocaleDateString()}
                </p>

                <div style={{ display: "flex", marginTop: "20px" }}>
                  <button style={styles.secondaryBtn} onClick={() => { setEditId(b._id); setForm(b); window.scrollTo(0,0); }}>Edit</button>
                  <button style={{...styles.secondaryBtn, color: "red"}} onClick={() => deleteBook(b._id)}>Delete</button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Books;