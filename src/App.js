import React, { useEffect } from 'react';
import './App.css';
import Header from './Components/Header/Header.js';
import Home from './Components/Home/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';
import { auth } from './firebase';
import { useStateValue } from './Hooks/StateProvider';
import Checkout from './Components/Checkout/Checkout';
import Payment from './Components/Payment/Payment';
import Orders from './Components/Orders/Orders';
import { loadStripe } from '@stripe/stripe-js';

import { Elements } from '@stripe/react-stripe-js';

const promise = loadStripe(
  'pk_test_51Kln9LLGsLdoY76q00Md9KipBewA6s29Hywi3vwrBoDwBpXybDVPr1KWIf5bRqRb7HQBQezG9tTkZQ5nHjAp4D9S00DWzIXCMO',
);

function App() {
  // leave the empty object intact
  const [dispatch] = useStateValue();

  useEffect(() => {
    // Will run once the app components loads

    auth.onAuthStateChanged((authUser) => {

      if (authUser) {
        //The user just logged in / the user was logged in
        dispatch({
          type: 'SET_USER',
          user: authUser,
        });
      } else {
        //User is logged out
        dispatch({
          type: 'SET_USER',
          user: null,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/payment"
            element={
              <Elements stripe={promise}>
                <Payment />
              </Elements>
            }
          />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
