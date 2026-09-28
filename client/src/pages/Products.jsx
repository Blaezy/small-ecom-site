import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data.products);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-400">Loading products...</p>;
  if (error) return <p className="text-center mt-10 text-red-400">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Products</h1>
        {user && <Link to="/products/new" className="btn-primary">+ Add Product</Link>}
      </div>

      {products.length === 0 ? (
        <p className="text-gray-400">No products yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((p) => (
            <div key={p._id} className="card">
              <h2 className="font-medium">{p.name}</h2>
              <p className="text-sm text-gray-400 mt-1">{p.description}</p>
              <div className="flex items-center justify-between mt-3 text-sm">
                <span className="text-accent font-semibold">₹{p.price}</span>
                <span className="text-gray-400">Stock: {p.stock}</span>
              </div>
              {user && (
                <div className="flex gap-2 mt-3">
                  <Link to={`/products/${p._id}/edit`} className="btn-primary text-sm px-3 py-1.5">Edit</Link>
                  <button onClick={() => handleDelete(p._id)} className="btn-danger">Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
