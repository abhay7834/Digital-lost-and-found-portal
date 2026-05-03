import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditItem() {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/items/my-items",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        );

        const item = res.data.find((i) => i._id === id);

        if (item) {
          setForm({
            title: item.title || "",
            description: item.description || "",
            location: item.location || "",
            contact: item.contact || "",
            status: item.status || "Lost",
            lostDate: item.lostDate
              ? item.lostDate.split("T")[0]
              : ""
          });
        }

      } catch (err) {
        console.log(err);
      }
    };

    fetchItem();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // 🔥 append text fields
    for (let key in form) {
      formData.append(key, form[key]);
    }

    // 🔥 append images (IMPORTANT FIX)
    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      await axios.put(
        `http://localhost:5000/api/items/${id}`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      alert("Item Updated ✅");
      navigate("/my-items");

    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data);
      alert("Update Failed ❌");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.heading}>Edit Item</h2>

        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" style={styles.input} />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" style={styles.input} />
        <input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact" style={styles.input} />

        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" style={styles.input} />

        <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>

        <input type="date" name="lostDate" value={form.lostDate} onChange={handleChange} style={styles.input} />

        {/* 🔥 FIXED INPUT */}
        <input
          type="file"
          name="images"
          multiple
          onChange={(e) => setImages([...e.target.files])}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Update Item
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
    backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative"
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)"
  },
  card: {
    position: "relative",
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    zIndex: 1,
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
  },
  heading: {
    textAlign: "center"
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default EditItem;