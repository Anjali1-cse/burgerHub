import React, { useEffect, useState } from 'react';
import { API } from '../api';
import BurgerCard from './BurgerCard';

export default function BurgerMenu() {
  const [burgers, setBurgers] = useState([]);
  const [tempCart, setTempCart] = useState([]); // ✅ Parent manages temp cart

  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        const res = await API.get('/burgers');
        setBurgers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBurgers();
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {burgers.map((burger) => (
        <BurgerCard
          key={burger.id}
          burger={burger}
          tempCart={tempCart}
          setTempCart={setTempCart} // ✅ pass setTempCart
        />
      ))}
    </div>
  );
}
