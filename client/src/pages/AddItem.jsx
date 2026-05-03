import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    contact: "",
    status: "Lost",
    lostDate: ""
  });

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contact") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (
      !form.title ||
      !form.description ||
      !form.location ||
      !form.contact ||
      !form.lostDate
    ) {
      return setError("All fields are required");
    }

    if (form.contact.length !== 10) {
      return setError("Contact must be 10 digits");
    }

    const today = new Date().toISOString().split("T")[0];
    if (form.lostDate > today) {
      return setError("Future date not allowed");
    }

    if (images.length === 0) {
      return setError("Please select at least one image");
    }

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      images.forEach((img) => {
        formData.append("images", img);
      });

      await axios.post(
        "http://localhost:5000/api/items/add",
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      setMessage("Item added successfully ✅");

      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } catch (err) {
      setError(err.response?.data || "Error adding item");
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.heading}>Add Item</h2>

        {error && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}

        <input
          name="title"
          placeholder="Item Title"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="contact"
          placeholder="Contact (10 digits)"
          value={form.contact}
          onChange={handleChange}
          style={styles.input}
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          style={{ ...styles.input, minHeight: "80px" }}
        />

        <select
          name="status"
          onChange={handleChange}
          style={styles.input}
        >
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>

        <input
          type="date"
          name="lostDate"
          value={form.lostDate}
          onChange={handleChange}
          max={new Date().toISOString().split("T")[0]}
          required
          style={styles.input}
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages([...e.target.files])}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Add Item
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a"
  },

  card: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "14px",
    width: "380px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.4)"
  },

  heading: {
    textAlign: "center",
    color: "white"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    outline: "none",
    cursor: "pointer"
  },

  button: {
    padding: "10px",
    background: "#3b82f6", // 🔥 fixed
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "0.3s"
  },

  error: {
    color: "#f87171",
    fontSize: "13px",
    textAlign: "center"
  },

  success: {
    color: "#22c55e",
    fontSize: "13px",
    textAlign: "center"
  }
};

export default AddItem;