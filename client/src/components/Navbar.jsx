import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const [notifCount, setNotifCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  const fetchNotifCount = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/notifications/count",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      setNotifCount(res.data.count);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotifCount();

    const interval = setInterval(() => {
      fetchNotifCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.nav}>
      
      {/* LOGO */}
      <h2 style={styles.logo} onClick={() => navigate("/home")}>
        Lost & Found
      </h2>

      {/* LINKS */}
      <div style={styles.links}>
        <Link to="/home" style={styles.link}>Home</Link>
        <Link to="/add" style={styles.link}>Add Item</Link>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/about" style={styles.link}>About</Link>

        <button onClick={() => navigate("/my-claims")} style={styles.btn}>
          My Claims
        </button>

        <button onClick={() => navigate("/my-items")} style={styles.btn}>
          My Items
        </button>

        {/* USER */}
        {username && (
          <span style={styles.user}>
            👤 {username}
          </span>
        )}

        {/* NOTIFICATIONS */}
        <button
          onClick={() => navigate("/notifications")}
          style={styles.notifBtn}
        >
          🔔
          {notifCount > 0 && (
            <span style={styles.badge}>
              {notifCount}
            </span>
          )}
        </button>

        {/* LOGOUT */}
        <button onClick={handleLogout} style={styles.logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 30px",
    background: "linear-gradient(90deg, #0f172a, #1e293b)",
    color: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },

  logo: {
    cursor: "pointer",
    fontWeight: "bold",
    letterSpacing: "1px"
  },

  links: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap"
  },

  link: {
    color: "#e2e8f0",
    textDecoration: "none",
    fontSize: "14px",
    transition: "0.3s"
  },

  user: {
    background: "#1e293b",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "13px"
  },

  btn: {
    background: "#3b82f6",
    border: "none",
    padding: "6px 12px",
    borderRadius: "20px",
    color: "white",
    cursor: "pointer",
    transition: "0.3s",
    fontSize: "13px"
  },

  notifBtn: {
    position: "relative",
    background: "#334155",
    border: "none",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    color: "white",
    cursor: "pointer",
    fontSize: "16px"
  },

  logout: {
    background: "#ef4444",
    border: "none",
    padding: "6px 12px",
    borderRadius: "20px",
    color: "white",
    cursor: "pointer",
    transition: "0.3s",
    fontSize: "13px"
  },

  badge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    background: "#ef4444",
    color: "white",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "10px",
    fontWeight: "bold"
  }
};

export default Navbar;