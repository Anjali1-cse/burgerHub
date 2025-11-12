import React, { useEffect, useState } from "react";
import { API } from "../api";
import AddToCartButton from "../pages/AddToCartButton";
import "./BurgerCard.css";

export default function BurgerCard({ burger }) {
  const [toppings, setToppings] = useState([]);
  const [selectedToppingIds, setSelectedToppingIds] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(burger.price || 0);

  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const res = await API.get("/toppings");
        setToppings(res.data);
      } catch (err) {
        console.error("Error fetching toppings", err);
      }
    };
    fetchToppings();
  }, []);

  useEffect(() => {
    const toppingTotal = toppings
      .filter((t) => selectedToppingIds.includes(t.id))
      .reduce((sum, t) => sum + t.price, 0);

    setTotalPrice((burger.price + toppingTotal) * quantity);
  }, [selectedToppingIds, toppings, burger.price, quantity]);

  const toggleTopping = (id) => {
    setSelectedToppingIds((prev) =>
      prev.includes(id)
        ? prev.filter((tId) => tId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="card">
      <img
        className="card-img"
        src={burger.imageUrl || burger.image}
        alt={burger.name}
      />
      <div className="card-body">
        <h3>{burger.name}</h3>
        <p className="muted">{burger.description}</p>
        <p><strong>Base:</strong> ₹{burger.price}</p>

        <div className="toppings-row">
          {toppings.slice(0, 6).map((t) => (
            <label key={t.id} className="topping">
              <input
                type="checkbox"
                checked={selectedToppingIds.includes(t.id)}
                onChange={() => toggleTopping(t.id)}
              />
              {t.name} (+₹{t.price})
            </label>
          ))}
        </div>

        <div className="card-controls">
          <div className="qty">
            <label>Qty</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number(e.target.value)))
              }
            />
          </div>

          <div className="price">₹{totalPrice}</div>

          <AddToCartButton
            burger={burger}
            toppingIds={selectedToppingIds}
            quantity={quantity}
            totalPrice={totalPrice}
            action="add"
          />
        </div>
      </div>
    </div>
  );
}
