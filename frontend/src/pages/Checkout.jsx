import React, { useEffect, useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    paymentMethod: "COD",
    deliveryOption: "DELIVERY", // ✅ Add delivery option
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await API.get("/cart/me", {
        headers: { "x-auth-token": token },
      });
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Failed to load cart", err);
      alert("Please view cart before checkout");
      navigate("/cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    setTotal(cartItems.reduce((sum, i) => sum + (i.totalPrice || 0), 0));
  }, [cartItems]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("Your cart is empty!");

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/checkout",
        {
          customer: form, // send full form including deliveryOption
          items: cartItems.map((i) => ({
            burgerId: i.burgerId,
            quantity: i.quantity,
            totalPrice: i.totalPrice,
          })),
          totalAmount: total,
        },
        { headers: { "x-auth-token": token } }
      );

      if (res.data.success) {
        alert("Order placed successfully!");
        navigate("/");
      } else {
        alert("Failed to place order");
      }
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <div className="checkout-grid">
        <div className="summary">
          <h3>Order Summary</h3>
          {cartItems.map((it) => (
            <div key={it.id} className="summary-item">
              <div>{it.Burger?.name} × {it.quantity}</div>
              <div>₹{it.totalPrice}</div>
            </div>
          ))}
          <hr />
          <h3>Total: ₹{total}</h3>
        </div>

        <form className="checkout-form" onSubmit={submitOrder}>
          <h3>Delivery Information</h3>
          <input
            name="fullName"
            placeholder="Full name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <label>Payment Method</label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
          >
            <option value="COD">Cash on Delivery</option>
            <option value="ONLINE">Online Payment</option>
          </select>

          <label>Delivery Option</label>
          <select
            name="deliveryOption"
            value={form.deliveryOption}
            onChange={handleChange}
          >
            <option value="DELIVERY">Delivery</option>
            <option value="PICKUP">Pickup</option>
          </select>

          <button className="btn" disabled={submitting}>
            {submitting ? "Placing..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
