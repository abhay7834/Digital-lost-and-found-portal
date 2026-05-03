import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyItems() {
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/items/my-items",
        {
          headers: { Authorization: "Bearer " + token }
        }
      );
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/items/${id}`,
        {
          headers: { Authorization: "Bearer " + token }
        }
      );
      fetchItems();
    } catch (err) {
      console.log(err);
    }
  };

  const getImageUrl = (item) => {
    let file = null;

    if (item.images && item.images.length > 0) {
      file = item.images[0];
    } else if (item.image) {
      file = item.image;
    }

    if (!file) return null;

    file = file.replace(/^uploads\//, "");
    return `http://localhost:5000/uploads/${file}`;
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>My Items</h2>

      {items.length === 0 ? (
        <p style={styles.empty}>No items uploaded yet</p>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => {
            const imageUrl = getImageUrl(item);

            return (
              <div key={item._id} style={styles.card}>

                {/* IMAGE */}
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    style={styles.image}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div style={styles.noImage}>No Image</div>
                )}

                {/* CONTENT */}
                <div style={styles.content}>
                  <h3 style={styles.title}>{item.title}</h3>

                  <p style={styles.info}>📍 {item.location}</p>

                  <p style={styles.date}>
                    {item.lostDate
                      ? new Date(item.lostDate).toLocaleDateString()
                      : "No Date"}
                  </p>

                  <span style={styles.status}>
                    {item.status}
                  </span>
                </div>

                {/* ACTION BUTTONS */}
                <div style={styles.actions}>
                  <button
                    style={styles.editBtn}
                    onClick={() => navigate(`/edit/${item._id}`)}
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteItem(item._id)}
                  >
                    Delete
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
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

  heading: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "26px",
    fontWeight: "bold"
  },

  empty: {
    textAlign: "center",
    color: "#94a3b8"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "25px"
  },

  card: {
    background: "#1e293b",
    borderRadius: "14px",
    overflow: "hidden",
    transition: "0.3s",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(0,0,0,0.4)"
  },

  image: {
    width: "100%",
    height: "170px",
    objectFit: "cover"
  },

  noImage: {
    height: "170px",
    background: "#334155",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  content: {
    padding: "12px"
  },

  title: {
    fontSize: "18px",
    fontWeight: "600"
  },

  info: {
    fontSize: "13px",
    color: "#cbd5f5"
  },

  date: {
    fontSize: "12px",
    color: "#94a3b8"
  },

  status: {
    display: "inline-block",
    marginTop: "5px",
    padding: "4px 8px",
    borderRadius: "6px",
    background: "#3b82f6",
    fontSize: "12px"
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px"
  },

  editBtn: {
    background: "#3b82f6",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    transition: "0.3s"
  },

  deleteBtn: {
    background: "#ef4444",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    transition: "0.3s"
  }
};

export default MyItems;