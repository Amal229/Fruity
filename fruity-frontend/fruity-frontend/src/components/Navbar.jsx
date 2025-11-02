import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Navbar.css";

const Navbar = ({ user, setUser }) => {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) return setCartCount(0);
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.items) setCartCount(res.data.items.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCartCount();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setCartCount(0);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-solid shadow-sm">
      <Link className="navbar-brand ms-3" to="/">Fruity<span style={{color:"#27ae60"}}>Shop</span></Link>

      <button
        className="navbar-toggler me-3"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto ms-3">
          <li className="nav-item">
            <Link className="nav-link" to="/">Products</Link>
          </li>
          {user && (
            <li className="nav-item">
              <Link className="nav-link" to="/cart">Cart ({cartCount})</Link>
            </li>
          )}
        </ul>

        <ul className="navbar-nav ms-auto me-3">
          {user ? (
            <>
              <li className="nav-item me-2">
                <span className="navbar-text">Hi, {user.email}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger btn-hover" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link className="btn btn-primary btn-hover" to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

