import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem, selectCartCount, selectCartItems, updateQuantity } from './CartSlice.jsx';
import placeholder from './assets/plant-placeholder.svg';

const money = (amount) => `${amount.toFixed(2)}`;
const calculateTotalCost = (item) => item.price * item.quantity;
const calculateTotalAmount = (items) => items.reduce((sum, item) => sum + calculateTotalCost(item), 0);

export default function CartItem() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartCount);
  const cartTotal = calculateTotalAmount(items);
  const [checkoutMessage, setCheckoutMessage] = useState('');

  function adjustQuantity(id, change) {
    dispatch(updateQuantity({ id, change }));
  }

  return (
    <main id="main-content" className="cart-page container">
      <div className="cart-title-row">
        <div>
          <span className="eyebrow">YOUR GREEN COMPANIONS</span>
          <h1>Your shopping cart<span className="cart-title-period">.</span></h1>
          <p>{itemCount === 0 ? 'Your cart is waiting for something green.' : `${itemCount} ${itemCount === 1 ? 'plant' : 'plants'} ready for a new home.`}</p>
        </div>
        <Link to="/plants" className="text-link">← Continue Shopping</Link>
      </div>

      {items.length === 0 ? (
        <section className="empty-cart" aria-label="Empty shopping cart">
          <div className="empty-cart-icon" aria-hidden="true">♧</div>
          <h2>A little empty in here.</h2>
          <p>Find your perfect plant, and let the green goodness begin.</p>
          <Link to="/plants" className="button button-dark">Explore Plants →</Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-items" aria-label="Shopping cart items">
            <div className="cart-items-heading"><h2>My plants</h2><span>{itemCount} items</span></div>
            {items.map((item) => (
              <article key={item.id} className="cart-line cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-line-image"
                  onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = placeholder; }}
                />
                <div className="cart-line-info">
                  <span className="cart-item-category">{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>Unit price: {money(item.price)}</p>
                  <button
                    type="button"
                    className="remove-link cart-item-delete"
                    onClick={() => dispatch(removeItem(item.id))}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove item
                  </button>
                </div>
                <div className="cart-line-controls">
                  <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                    <button
                      type="button"
                      className="cart-item-decrement"
                      aria-label={`Decrease ${item.name} quantity`}
                      onClick={() => adjustQuantity(item.id, -1)}
                    >−</button>
                    <output aria-live="polite">{item.quantity}</output>
                    <button
                      type="button"
                      className="cart-item-increment"
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() => adjustQuantity(item.id, 1)}
                      disabled={item.quantity >= 99}
                    >+</button>
                  </div>
                  <strong className="line-total">{money(calculateTotalCost(item))}</strong>
                </div>
              </article>
            ))}
          </section>
          <aside className="order-summary" aria-label="Order summary">
            <span className="eyebrow">YOUR ORDER</span>
            <h2>Order Summary</h2>
            <div className="summary-row"><span>Total quantity</span><strong>{itemCount}</strong></div>
            <div className="summary-row"><span>Subtotal</span><strong>{money(cartTotal)}</strong></div>
            <div className="summary-row"><span>Shipping</span><strong>Calculated later</strong></div>
            <div className="summary-total"><span>Total</span><strong>{money(cartTotal)}</strong></div>
            <button type="button" className="button button-dark button-checkout get-started-button" onClick={() => setCheckoutMessage('Coming Soon! Checkout is not available yet.')}>
              Checkout →
            </button>
            {checkoutMessage && <p className="checkout-message" role="status">{checkoutMessage}</p>}
            <Link className="summary-continue get-started-button" to="/plants">← Continue Shopping</Link>
            <p className="summary-footer">🌱 &nbsp;Thank you for growing with us.</p>
          </aside>
        </div>
      )}
    </main>
  );
}
