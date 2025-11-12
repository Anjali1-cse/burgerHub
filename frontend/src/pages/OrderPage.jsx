import React, { useEffect, useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import "./OrderPage.css";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view your orders");
      navigate("/login");
      return;
    }

    try {
      const res = await API.get("/orders/me", {
        headers: { "x-auth-token": token },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading your orders...</p>;

  if (orders.length === 0) return <p>You have no orders yet.</p>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <h3>Order #{order.id}</h3>
            <p>Status: {order.status}</p>
            <p>Total: ₹{order.totalAmount}</p>
            <p>Payment: {order.paymentMethod}</p>
            <p>Delivery: {order.deliveryOption}</p>
          </div>

          <div className="order-items">
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <div>
                  {item.burger?.name} × {item.quantity}
                  {item.toppings && item.toppings.length > 0 && (
                    <div className="toppings-list">
                      <small>Toppings: {item.toppings.join(", ")}</small>
                    </div>
                  )}
                </div>
                <div>₹{item.price}</div>
              </div>
            ))}
          </div>


        </div>
      ))}
    </div>
  );
}
