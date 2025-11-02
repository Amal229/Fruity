// src/pages/CartPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CartPage.css";
const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch cart items when page loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found — please log in first.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const { items, totalCartPrice } = res.data;
        setCartItems(items);
        setTotalCartPrice(totalCartPrice);
      })
      .catch((err) => console.error("Error fetching cart:", err))
      .finally(() => setLoading(false));
  }, []);

  // 🔵 Update item quantity
  const updateQuantity = (id, newQty) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .patch(
        `http://localhost:5000/cart/${id}`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        // Update locally
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: newQty,
                  totalPriceForItem: Number(
                    (item.discountedPrice * newQty).toFixed(2)
                  ),
                }
              : item
          )
        );
        // Recalculate total cart price
        setTotalCartPrice((prev) =>
          cartItems
            .map((item) =>
              item.id === id
                ? item.discountedPrice * newQty
                : item.totalPriceForItem
            )
            .reduce((sum, val) => sum + val, 0)
        );
      })
      .catch((err) => console.error("Error updating quantity:", err));
  };

  //  Remove one item
  const removeItem = (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .delete(`http://localhost:5000/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        const newCart = cartItems.filter((item) => item.id !== id);
        setCartItems(newCart);
        setTotalCartPrice(
          newCart.reduce((sum, item) => sum + item.totalPriceForItem, 0)
        );
      })
      .catch((err) => console.error("Error deleting item:", err));
  };

  //  Clear entire cart
  const clearCart = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .delete("http://localhost:5000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setCartItems([]);
        setTotalCartPrice(0);
        alert("Cart emptied successfully!");
      })
      .catch((err) => console.error("Error clearing cart:", err));
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="container mt-4">
      <h2 className="cart-header mb-4 text-center">🛒 My Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="card mb-3 shadow-sm p-3"
              style={{ borderRadius: "12px" }}
            >
              <div className="row g-0 align-items-center">
                <div className="col-md-3 text-center">
                  <img
                    src={item.image || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="img-fluid rounded"
                    style={{ maxHeight: "120px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-6">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text mb-1">
  was : <span className="original-price">{item.originalPrice.toFixed(2)} BD</span>
</p>
<p className="card-text mb-1">
  now : <span className="discounted-price">{item.discountedPrice.toFixed(2)} BD</span>
</p>

                    <p className="card-text mb-1">
                      Quantity: <strong>{item.quantity}</strong>
                    </p>
                    <p className="fw-bold">
                      Subtotal: {item.totalPriceForItem.toFixed(2)} BD
                    </p>
                  </div>
                </div>
                <div className="col-md-3 d-flex flex-column align-items-center gap-2">
                  <div>
                    <button
                      className="btn btn-outline-secondary me-2"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        item.quantity > 1 &&
                        updateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      –
                    </button>
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm mt-2"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="text-center mt-4">
            <h3>Total: {totalCartPrice.toFixed(2)} BD</h3>
            <button
              onClick={clearCart}
              className="btn btn-danger mt-2 px-4 py-2 me-2"
            >
              Empty Cart
            </button>
             <button
    className="btn btn-success mt-2 px-4 py-2"
  >
    Checkout
  </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
