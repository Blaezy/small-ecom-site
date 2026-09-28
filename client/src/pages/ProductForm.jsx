import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";


const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", category: "" });
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) return;
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        const p = data.product;
        setForm({
          name: p.name,
          description: p.description || "",
          price: p.price,
          stock: p.stock,
          category: p.category || "",
        });
      } catch (err) {
        setErrors([err.response?.data?.message || "Failed to load product"]);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEditMode]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock || 0),
    };

    try {
      if (isEditMode) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/");
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors) {
        setErrors(apiErrors.map((er) => er.message));
      } else {
        setErrors([err.response?.data?.message || "Something went wrong"]);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-16 card">
      <h1 className="text-xl font-semibold mb-4">{isEditMode ? "Edit Product" : "Add Product"}</h1>

      {errors.length > 0 && (
        <ul className="mb-4 text-sm text-red-400 list-disc list-inside space-y-1">
          {errors.map((msg, i) => <li key={i}>{msg}</li>)}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} className="w-full" required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full" />
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} className="w-full" required />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} className="w-full" />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="w-full" />
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
