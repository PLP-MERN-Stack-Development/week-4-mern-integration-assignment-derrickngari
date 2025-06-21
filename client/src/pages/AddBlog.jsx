import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { RichTextEditor } from "@mantine/rte";

const AddBlog = () => {
  const { user } = useContext(AuthContext);  
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: null,
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null); // Preview image
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch categories on mount
  useEffect(() => {
    axios.get("http://localhost:3000/api/category")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle regular inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title || !form.excerpt || !form.content || !form.category) {
      return setError("Please fill in all required fields.");
    }

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("excerpt", form.excerpt);
      formData.append("content", form.content); // Already sanitized on server
      if (form.image) formData.append("featuredImage", form.image);
      formData.append("category", form.category);
      formData.append("author", user?._id);

      await axios.post(
        "http://localhost:3000/api/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      setSuccess("Blog added successfully!");
      setForm({ title: "", excerpt: "", content: "", image: null, category: "" });
      setImagePreview(null); // Reset preview
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };
  

  return (
    <div className="mx-auto mt-10 p-6 bg-slate-900 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-white">Add New Blog</h2>

      {error && <p className="text-red-400 mb-3">{error}</p>}
      {success && <p className="text-green-400 mb-3">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-white">
        {/* Title */}
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Blog Title"
          className="p-2 rounded bg-slate-800 border border-emerald-500 outline-none"
        />

        {/* Description */}
        <input
          type="text"
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          placeholder="Short Description"
          className="p-2 rounded bg-slate-800 border border-emerald-500 outline-none"
        />

        {/* Rich text content */}
        <RichTextEditor
          value={form.content}
          onChange={(value) => setForm((prev) => ({ ...prev, content: value }))}
          placeholder="Write your blog content here..."
          style={{ backgroundColor: "#f0f0f0" }}
          controls={[
            ['bold', 'italic', 'underline', 'strikeThrough'],
            ['h1', 'h2', 'h3'],
            ['unorderedList', 'orderedList'],
            ['link', 'image', 'video'],
            ['alignLeft', 'alignCenter', 'alignRight'],
            ['sup', 'sub'],
            ['code', 'blockquote'],
            ['undo', 'redo'],
            ['clear'],
          ]}
        />

        {/* Image input */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="text-sm"
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 h-32 w-32 object-cover border border-emerald-500 rounded"
          />
        )}

        {/* Category select */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="p-2 rounded bg-slate-800 border border-emerald-500 outline-none"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Submit */}
        <button
          className="mt-5 w-full text-center hover:bg-emerald-950 cursor-pointer hover:text-emerald-500 border border-emerald-500 text-emerald-500 font-bold px-6 py-2 rounded outline-none"
          type="submit"
        >
          Submit Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
