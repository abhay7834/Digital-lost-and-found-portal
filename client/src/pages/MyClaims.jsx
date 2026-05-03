import { useEffect, useState } from "react";
import axios from "axios";

function MyClaims() {
  const [claims, setClaims] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/claims/my",
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      );

      setClaims(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Approved") return styles.approved;
    if (status === "Rejected") return styles.rejected;
    return styles.pending;
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>My Claims</h2>

      {claims.length === 0 ? (
        <p>No claims yet</p>
      ) : (
        <div style={styles.grid}>
          {claims.map((claim) => (
            <div key={claim._id} style={styles.card}>

              {/* IMAGE */}
              {claim.itemId?.images?.length > 0 ? (
                <img
                  src={`http://localhost:5000/uploads/${claim.itemId.images[0]}`}
                  style={styles.image}
                />
              ) : claim.itemId?.image ? (
                <img
                  src={`http://localhost:5000/uploads/${claim.itemId.image}`}
                  style={styles.image}
                />
              ) : (
                <div style={styles.noImage}>No Image</div>
              )}

              {/* 🔥 TITLE */}
              <h3 style={styles.title}>
                📌 {claim.itemId?.title || "No Title"}
              </h3>

              {/* 🔥 LOCATION */}
              <p style={styles.info}>
                📍 <b>Location:</b> {claim.itemId?.location || "N/A"}
              </p>

              {/* 🔥 DESCRIPTION */}
              <p style={styles.desc}>
                📝 <b>Description:</b> {claim.itemId?.description || "N/A"}
              </p>

              {/* 🔥 STATUS */}
              <p style={{ ...styles.status, ...getStatusStyle(claim.status) }}>
                {claim.status}
              </p>

              {/* 🔥 USER MESSAGE */}
              <p style={styles.message}>
                💬 <b>Your Message:</b> {claim.message}
              </p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    padding: "20px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white"
  },

  heading: {
    textAlign: "center",
    marginBottom: "20px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    transition: "0.3s"
  },

  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px"
  },

  noImage: {
    height: "160px",
    background: "#334155",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "8px",
    marginBottom: "10px"
  },

  title: {
    margin: "10px 0 5px",
    fontSize: "18px"
  },

  info: {
    fontSize: "13px",
    marginBottom: "5px"
  },

  desc: {
    fontSize: "12px",
    color: "#94a3b8",
    wordBreak: "break-word",
    overflowWrap: "break-word"
  },

  status: {
    fontWeight: "bold",
    marginTop: "8px"
  },

  approved: {
    color: "#22c55e"
  },

  rejected: {
    color: "#ef4444"
  },

  pending: {
    color: "#facc15"
  },

  message: {
    marginTop: "8px",
    fontSize: "13px",
    wordBreak: "break-word",
    overflowWrap: "break-word"
  }
};

export default MyClaims;