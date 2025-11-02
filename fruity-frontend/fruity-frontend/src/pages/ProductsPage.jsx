import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./ProductsPage.css";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await API.get("/products", { headers });
      setProducts(response.data);

      // Initialize quantities
      const initialQuantities = {};
      response.data.forEach((p) => (initialQuantities[p.id] = 1));
      setQuantities(initialQuantities);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      alert("Could not fetch products.");
    }
  };

  const increaseQuantity = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decreaseQuantity = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] > 1 ? prev[id] - 1 : 1 }));
  };

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add to cart.");
      navigate("/login");
      return;
    }

    try {
      const quantity = quantities[productId];
      await API.post(
        "/cart",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Item added to cart!");
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      alert("Failed to add to cart.");
    }
  };

  return (
    <div className="container my-4">
      <h2 className="products-header mb-4 text-center">🛍️ Fruity Products</h2>
      <div className="row g-4">
        {products.map((product) => {
          const qty = quantities[product.id] || 1;
          const hasDiscount = product.discountedPrice !== null;
          const discountPercent = hasDiscount
            ? Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)
            : 0;
          const totalPrice = ((hasDiscount ? product.discountedPrice : product.originalPrice) * qty).toFixed(2);

          return (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100 shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="card-img-top product-img"
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>

                  {hasDiscount ? (
                    <p className="card-text">   
                      <small className="text-danger">({discountPercent}% off)</small><br />
                      <span className="text-decoration-line-through text-muted">
                        {product.originalPrice}BD
                      </span>{" "}
                      <span className="text-success fw-bold">{product.discountedPrice}BD</span>
                   
                    </p>
                  ) : (
                    <p className="card-text">{product.originalPrice}BD</p>
                  )}

                  <div className="d-flex justify-content-center align-items-center mb-2">
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => decreaseQuantity(product.id)}>-</button>
                    <span>{qty}</span>
                    <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => increaseQuantity(product.id)}>+</button>
                  </div>

                  <p className="text-center mb-2">Total: {totalPrice}BD</p>

                  <button className="btn btn-success mt-auto" onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProductsPage;
