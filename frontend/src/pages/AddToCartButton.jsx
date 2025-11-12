import React, { useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";

export default function AddToCartButton({
  burger,
  toppingIds = [],
  quantity = 1,
  totalPrice = 0,
  action = "add",
  onComplete,
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addToCart = async () => {
    if (!burger?.id) return alert("Invalid burger.");

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add to cart.");
      navigate("/login");
      return;
    }

    const item = { burgerId: burger.id, toppingIds, quantity, totalPrice };

    setLoading(true);
    try {
      const res = await API.post("/cart/add", item, {
        headers: { "x-auth-token": token },
      });

      if (res.status === 201) {
        alert(`${burger.name} added to cart!`);
        if (onComplete) onComplete(res.data);
        if (action === "checkout") navigate("/checkout");
      } else {
        alert("Failed to add to cart.");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error adding to cart.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="add-btn"
        disabled={loading}
        onClick={addToCart}
      >
        {loading
          ? "Adding..."
          : action === "checkout"
          ? "Buy Now"
          : "Add to Cart"}
      </button>

      {/* ✅ Use normal <style> for inline CSS */}
      <style>{`
        .add-btn {
          background: linear-gradient(135deg, #ff7b00, #ff4d4d);
          color: #fff;
          border: none;
          border-radius: 25px;
          padding: 10px 20px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: all 0.25s ease;
          box-shadow: 0 3px 10px rgba(255, 123, 0, 0.2);
        }

        .add-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(255, 123, 0, 0.35);
        }

        .add-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          box-shadow: none;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .add-btn:disabled {
          animation: pulse 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
