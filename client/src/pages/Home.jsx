import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const [currentSlide, setCurrentSlide] = useState(0);

  const [claimOpen, setClaimOpen] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [loadingClaim, setLoadingClaim] = useState(false);

  const token = localStorage.getItem("token");

  const slides = [
    "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
  ];

  useEffect(() => {
    fetchItems();

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchLocation, searchDate, items]);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/items", {
        headers: { Authorization: "Bearer " + token }
      });

      setItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filterItems = () => {
    let filtered = items;

    if (searchLocation) {
      filtered = filtered.filter(item =>
        item.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    if (searchDate) {
      filtered = filtered.filter(item => {
        if (!item.lostDate) return false;
        const itemDate = new Date(item.lostDate).toISOString().split("T")[0];
        return itemDate === searchDate;
      });
    }

    setFilteredItems(filtered);
  };

  const submitClaim = async () => {
    if (!claimMessage) return alert("Enter message");

    try {
      setLoadingClaim(true);

      await axios.post(
        "http://localhost:5000/api/claims/add",
        {
          itemId: selectedItem._id,
          message: claimMessage
        },
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      alert("Claim Submitted ");
      setClaimOpen(false);
      setSelectedItem(null);
      setClaimMessage("");
      fetchItems();

    } catch (err) {
      alert(err.response?.data || "Claim Failed ");
    } finally {
      setLoadingClaim(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "lost") return "#f87171";
    if (status === "found") return "#60a5fa";
    if (status === "claimed") return "#facc15";
    return "#22c55e";
  };

  return (
    <div style={styles.page}>

      {/* HERO SLIDER */}
      <div style={styles.slider}>
        <img src={slides[currentSlide]} style={styles.sliderImage} />
        <div style={styles.overlay}>
          <h1 style={styles.heroTitle}>Lost & Found Portal</h1>
          <p style={styles.heroSub}>Find or report lost items easily</p>
        </div>
      </div>

      {/* SEARCH */}
      <div style={styles.searchBox}>
        <input
          placeholder="Search by location..."
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          style={styles.input}
        />

        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* ITEMS GRID */}
      <div style={styles.grid}>
        {filteredItems.length === 0 ? (
          <h2 style={{ color: "#94a3b8" }}>No items found</h2>
        ) : (
          filteredItems.map(item => (
            <div
              key={item._id}
              style={styles.card}
              onClick={() => setSelectedItem(item)}
            >
              <img
                src={
                  item.images?.length > 0
                    ? `http://localhost:5000/uploads/${item.images[0]}`
                    : item.image
                    ? `http://localhost:5000/uploads/${item.image}`
                    : ""
                }
                style={styles.image}
              />

              <div style={styles.cardBody}>
                <h3>{item.title}</h3>

                <p style={styles.muted}>📍 {item.location}</p>

                <p style={styles.desc}>{item.description}</p>

                <p style={styles.date}>
                  {item.lostDate
                    ? new Date(item.lostDate).toLocaleDateString()
                    : "No Date"}
                </p>

                <span
                  style={{
                    ...styles.badge,
                    background: getStatusColor(item.status)
                  }}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {selectedItem && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>{selectedItem.title}</h2>

            <img
              src={`http://localhost:5000/uploads/${selectedItem.images?.[0]}`}
              style={styles.modalImage}
            />

            <p>{selectedItem.description}</p>
            <p><b>Location:</b> {selectedItem.location}</p>

            <button
              style={styles.claimBtn}
              onClick={() => setClaimOpen(true)}
            >
              Claim Item
            </button>

            <button onClick={() => setSelectedItem(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* CLAIM MODAL */}
      {claimOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Claim This Item</h3>

            <textarea
              value={claimMessage}
              onChange={(e) => setClaimMessage(e.target.value)}
              style={styles.textarea}
            />

            <button onClick={submitClaim}>
              {loadingClaim ? "Submitting..." : "Submit"}
            </button>

            <button onClick={() => setClaimOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { background: "#0f172a", minHeight: "100vh", color: "white" },

  slider: { height: "300px", position: "relative" },
  sliderImage: { width: "100%", height: "100%", objectFit: "cover" },

  overlay: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },

  heroTitle: { fontSize: "36px", fontWeight: "bold" },
  heroSub: { color: "#cbd5f5" },

  searchBox: {
  display: "flex",
  justifyContent: "center",
  gap: "15px",
  padding: "15px 20px",
  marginTop: "20px",
  background: "#1e293b",
  width: "fit-content",
  marginLeft: "auto",
  marginRight: "auto",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
},

 input: {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
  outline: "none"
},
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
    padding: "40px"
  },

  card: {
    background: "#1e293b",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "0.3s"
  },

  image: { width: "100%", height: "160px", objectFit: "cover" },

  cardBody: { padding: "12px" },

  muted: { color: "#94a3b8", fontSize: "13px" },

  desc: { fontSize: "12px", color: "#94a3b8" },

  date: { fontSize: "12px", color: "#94a3b8" },

  badge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "6px",
    marginTop: "5px",
    fontSize: "12px"
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "#1e293b",
    color: "white",
    padding: "20px",
    borderRadius: "12px",
    width: "400px"
  },

  modalImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px"
  },

  claimBtn: {
    background: "#22c55e",
    color: "white",
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    marginTop: "10px"
  },

  textarea: {
    width: "100%",
    height: "80px",
    marginTop: "10px",
    padding: "8px"
  }
};

export default Home;