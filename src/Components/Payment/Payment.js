import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Payment.css';
import { useStateValue } from '../../Hooks/StateProvider';
import CheckoutProduct from '.././CheckoutProduct/CheckoutProduct';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from '../../Hooks/reducer';
import axios from '../../axios';
import { db } from '../../firebase';
import { doc, setDoc, collection } from 'firebase/firestore';

export default function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();

  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState('');
  const [clientSecret, setClientSecret] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Generate stripe secret that allow to charge customer
    const getClientSecret = async () => {
      const response = await axios({
        method: 'post',
        header: {
          'Access-Control-Allow-Origin': true,
          'Content-Type': 'application/json',
        },
        // Stripe expects the total in currencies subunits(cents)
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
      });

      //Implement loading... waiting for data
      const client_secret = await response.data.client_secret;
      setClientSecret(client_secret);
      setLoading(false);
    };
    getClientSecret();
  }, [basket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        const usersRef = collection(db, 'users');
        const userIdRef = doc(usersRef, user.uid);
        setDoc(doc(userIdRef, 'orders', paymentIntent.id), {
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        });

        setSucceeded(true);
        setError(null);
        setProcessing(false);
        dispatch({
          type: 'EMPTY_BASKET',
        });

        //Redirect to orders
        navigate('/orders', { replace: true });
      });
    // payload();
  };

  const handleChange = (e) => {
    // Listen for changes
    setDisabled(e.empty);
    setError(e.error ? e.error.message : '');
  };

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} items</Link>)
        </h1>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email} </p>
            <p>Address</p>
            <p>City</p>
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map((item) => (
              <CheckoutProduct
                key={item.id}
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>
        {loading && (
          <div className="loading">Wait! loading payment info...</div>
        )}
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Method</h3>
          </div>
          <div className="payment__details">
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />

              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={(value) => (
                    <>
                      <p>
                        Subtotal ({basket.length} items):{' '}
                        <strong>{value}</strong>
                      </p>
                      <small className="subtotal__gift">
                        <input type="checkbox" /> This order contains a gift
                      </small>
                    </>
                  )}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={'text'}
                  thousandSeparotor={true}
                  prefix={'$'}
                />
                <button
                  disabled={processing || disabled || succeeded}
                  onSubmit={handleSubmit}
                >
                  <span>{processing ? <p>Processing</p> : 'Buy Now'}</span>
                </button>
              </div>

              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
