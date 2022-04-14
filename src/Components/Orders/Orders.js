/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import './Orders.css';
import { db } from '../../firebase';
import { useStateValue } from '../../Hooks/StateProvider';
import Order from '../Order/Order';
import { collectionGroup, query, getDocs, orderBy } from 'firebase/firestore';

export default function Orders() {
  const [{ user }] = useStateValue();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getData = async () => {
      if (user) {
        const orders = query(
          collectionGroup(db, 'orders', orderBy('created', 'desc')),
        );
        const docQuerySnapShot = await getDocs(orders);
        docQuerySnapShot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          setOrders({
            // id: doc.id,
            data: doc.data(),
          });
        });
      } else {
        setOrders([]);
      }
    };

    getData();
  }, [user]);

  const orderComponent = Object.entries(orders).map(([key, values]) => {
    return <Order key={key} items={values} />;
  });

  return (
    <div className="orders">
      <h1>Your Orders</h1>
      <div className="orders__order">{orderComponent}</div>
    </div>
  );
}
