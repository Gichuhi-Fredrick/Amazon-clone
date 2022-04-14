import React from 'react';
import './Order.css';
import moment from 'moment';
import CheckoutProduct from '../CheckoutProduct/CheckoutProduct';
import CurrencyFormat from 'react-currency-format';

export default function Order({ items }) {
  return (
    <div className="order">
      <h2>Order</h2>
      <p>{moment.unix(items.created).format('MMMM Do YYYY, h:mma')}</p>
      {/* <p className="order__id">{<small>Order Id: {items.id}</small>}</p> */}
      {items.basket?.map((item) => (
        <CheckoutProduct
          id={item.id}
          title={item.title}
          image={item.image}
          price={item.price}
          rating={item.rating}
          hideButton
        />
      ))}
      <CurrencyFormat
        renderText={(value) => (
          <>
            <h3 className="order__total">Order Total: {value}</h3>
          </>
        )}
        decimalScale={2}
        value={items.amount / 100} //Convert to dollars from cents
        displayType={'text'}
        thousandSeparotor={true}
        prefix={'$'}
      />
    </div>
  );
}
