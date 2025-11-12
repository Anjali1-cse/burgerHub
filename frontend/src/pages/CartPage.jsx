import React, { useEffect, useState, useCallback } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // ✅ useCallback prevents the ESLint warning
  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view your cart");
      navigate("/login");
      return;
    }

    try {
      const res = await API.get("/cart/me", {
        headers: { "x-auth-token": token },
      });
      setItems(res.data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      alert("Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [navigate]); // ✅ add navigate as dependency since it's used inside

  useEffect(() => {
    fetchCart(); // ✅ safe now
  }, [fetchCart]); // ✅ include it here

  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + (item.totalPrice || 0), 0));
  }, [items]);

  const removeItem = async (id) => {
    if (!window.confirm("Remove item from cart?")) return;

    const token = localStorage.getItem("token");
    try {
      await API.delete(`/cart/${id}`, {
        headers: { "x-auth-token": token },
      });
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to remove item");
    }
  };

  if (loading) return <p>Loading your cart...</p>;

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {items.map((it) => (
              <div key={it.id} className="cart-item">
                <div>
                  <h4>{it.Burger?.name || "Burger"}</h4>
                  {it.toppings?.length > 0 && (
                    <p className="muted">
                      + {it.toppings.map((t) => t.name).join(", ")}
                    </p>
                  )}
                  <p>Qty: {it.quantity}</p>
                </div>
                <div className="cart-right">
                  <p>₹{it.totalPrice}</p>
                  <button
                    className="btn-danger"
                    onClick={() => removeItem(it.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total: ₹{total}</h3>
            <button
              onClick={() => navigate("/checkout")}
              className="btn"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
