import { useEffect, useState } from "react";
import API from "./api";
import "./style.css";

function App() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Images
  const getImages = async () => {
    try {
      const res = await API.get("/photos");
      setImages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  // Select Image
  const selectImage = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  // Upload Image
  const uploadImage = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);

      await API.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Image uploaded successfully");

      setFile(null);
      setPreview(null);

      getImages();
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete Image
  const deleteImage = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this photo?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/photos/${id}`);

      alert("Photo deleted successfully");

      getImages();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="page">
      <header>
        <h1>💍 Forever Memories</h1>
        <p>Your beautiful wedding moments</p>
      </header>

      <section className="upload-box">
        <h2>Upload Photo</h2>

        <input
          id="file"
          type="file"
          accept="image/*"
          onChange={selectImage}
        />

        <label htmlFor="file">Choose Image</label>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="preview"
          />
        )}

        <button onClick={uploadImage}>
          {loading ? "Uploading..." : "Upload Photo"}
        </button>
      </section>

      <h2 className="title">Gallery</h2>

      <div className="gallery">
        {images.length === 0 ? (
          <h3>No Photos Yet</h3>
        ) : (
          images.map((img) => (
            <div className="photo-card" key={img._id}>
              <img src={img.url} alt="Wedding" />

              <div className="overlay">
                Wedding Photo
              </div>

              <button
                className="delete-btn"
                onClick={() => deleteImage(img._id)}
              >
                🗑 Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;