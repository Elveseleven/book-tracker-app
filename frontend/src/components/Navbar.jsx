function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        borderBottom: "1px solid #ccc"
      }}
    >
      <h3>📚 Book Tracker</h3>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Navbar;