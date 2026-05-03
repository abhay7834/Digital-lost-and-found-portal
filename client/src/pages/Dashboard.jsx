import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [claims, setClaims] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/claims/owner",
        {
          headers: { Authorization: "Bearer " + token }
        }
      );
      setClaims(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, action) => {
    await axios.put(
      `http://localhost:5000/api/claims/${action}/${id}`,
      {},
      { headers: { Authorization: "Bearer " + token } }
    );
    fetchClaims();
  };

  const confirmGiven = async (id) => {
    await axios.put(
      `http://localhost:5000/api/claims/handover/owner/${id}`,
      {},
      { headers: { Authorization: "Bearer " + token } }
    );
    alert("Marked as given ✅");
    fetchClaims();
  };

  const getStatusStyle = (status) => {
    if (status === "Approved") return styles.accepted;
    if (status === "Rejected") return styles.rejected;
    return styles.pending;
  };

  return (
    <div style={styles.page}>
      <h2>Claim Requests</h2>

      <div style={styles.grid}>
        {claims.map((claim) => (
          <div key={claim._id} style={styles.card}>

            {/* 🔥 IMAGE BOX FIXED */}
            <div style={styles.imageBox}>
              {claim.itemId?.images?.length > 0 ? (
                <img
                  src={`http://localhost:5000/uploads/${claim.itemId.images[0]}`}
                  style={styles.image}
                />
              ) : (
                <div style={styles.noImage}>No Image</div>
              )}
            </div>

            <h3>{claim.itemId?.title}</h3>

            <p style={styles.text}>
              {claim.itemId?.description?.slice(0, 60)}...
            </p>

            <p><b>User:</b> {claim.claimantId?.name}</p>

            <p>
              <b>Status:</b>{" "}
              <span style={getStatusStyle(claim.status)}>
                {claim.status}
              </span>
            </p>

            {/* ACTIONS */}
            {claim.status === "Pending" && (
              <div style={styles.btnGroup}>
                <button
                  style={styles.acceptBtn}
                  onClick={() => updateStatus(claim._id, "accept")}
                >
                  Accept
                </button>

                <button
                  style={styles.rejectBtn}
                  onClick={() => updateStatus(claim._id, "reject")}
                >
                  Reject
                </button>
              </div>
            )}

            {/* HANDOVER */}
            {claim.status === "Approved" && !claim.handoverByOwner && (
              <button
                style={styles.handoverBtn}
                onClick={() => confirmGiven(claim._id)}
              >
                I Gave Item
              </button>
            )}

            {/* DONE */}
            {claim.handoverByOwner && claim.handoverByClaimant && (
              <p style={styles.completed}>
                ✅ Delivered
              </p>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "30px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    marginTop: "20px"
  },

  card: {
    background: "#1e293b",
    borderRadius: "12px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "380px"
  },

  imageBox: {
    width: "100%",
    height: "160px",
    overflow: "hidden",
    borderRadius: "8px",
    marginBottom: "10px"
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  noImage: {
    height: "100%",
    background: "#334155",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  text: {
    fontSize: "14px",
    color: "#cbd5f5"
  },

  btnGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "10px"
  },

  acceptBtn: {
    flex: 1,
    background: "#22c55e",
    border: "none",
    color: "white",
    padding: "8px",
    borderRadius: "6px"
  },

  rejectBtn: {
    flex: 1,
    background: "#ef4444",
    border: "none",
    color: "white",
    padding: "8px",
    borderRadius: "6px"
  },

  handoverBtn: {
    marginTop: "10px",
    background: "#3b82f6",
    border: "none",
    color: "white",
    padding: "8px",
    borderRadius: "6px"
  },

  accepted: { color: "#22c55e" },
  rejected: { color: "#ef4444" },
  pending: { color: "#facc15" },

  completed: {
    marginTop: "10px",
    color: "#22c55e",
    fontWeight: "bold"
  }
};

export default Dashboard;