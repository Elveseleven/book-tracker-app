import React from "react";

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    backgroundColor: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    marginBottom: "30px",
    borderRadius: "0 0 12px 12px"
  },
  logo: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    color: "#007bff",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  logoutBtn: {
    padding: "8px 18px",
    backgroundColor: "#fff",
    color: "#dc3545",
    border: "1px solid #dc3545",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.2s ease"
  },
  userInfo: {
    fontSize: "14px",
    color: "#666",
    fontWeight: "500"
  }
};

function Navbar() {
  const logout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };

  return (
    <nav style={styles.nav}>
      <h3 style={styles.logo}>
        <span style={{ fontSize: "28px" }}></span> 
        BookTracker
      </h3>

      <div style={styles.rightSection}>
        <span style={styles.userInfo}>Welcome back, Reader!</span>
        <button 
          style={styles.logoutBtn} 
          onClick={logout}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#dc3545";
            e.target.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "white";
            e.target.style.color = "#dc3545";
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;