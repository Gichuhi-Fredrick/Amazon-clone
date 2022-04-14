import React from 'react';
import './Subtotal.css';
import CurrencyFormat from 'react-currency-format';
import { useStateValue } from '../../Hooks/StateProvider';
import { getBasketTotal } from '../../Hooks/reducer';
import { useNavigate } from 'react-router';

export default function Subtotal() {
  const history = useNavigate();
  const [{ basket }, dispatch] = useStateValue();

  return (
    <div className="subtotal">
      <CurrencyFormat
        renderText={(value) => (
          <>
            <p>
              {/* Part of the homework */}
              Subtotal ({basket.length} items): <strong>{value}</strong>
            </p>
            <small className="subtotal__gift">
              <input type="checkbox" /> This order contains a gift
            </small>
          </>
        )}
        decimalScale={2}
        // {/* Part of the homework */}
        value={getBasketTotal(basket)}
        displayType={'text'}
        thousandSeparotor={true}
        prefix={'$'}
      />

      <button onClick={(e) => history('/payment')}>Proceed to checkout</button>
    </div>
  );
}
