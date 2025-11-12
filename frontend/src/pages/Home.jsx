import React, { useEffect, useState } from "react";
import { API } from "../api";
import BurgerCard from "../components/BurgerCard";
import "./Home.css";

export default function Home() {
  const [burgers, setBurgers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/burgers");
        setBurgers(res.data);
      } catch (err) {
        console.error("Failed to load burgers", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to Burger Shop</h1>
        <p>Delicious burgers. Customize your toppings. Fast delivery.</p>
      </section>

      <section className="list">
        <h2>Our Burgers</h2>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="grid">
            {burgers.map((b) => (
              <BurgerCard key={b.id || b._id} burger={b} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
