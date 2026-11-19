import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addItem, selectCartItems } from './CartSlice.jsx';
import { categories, plants } from './data/plants.js';
import placeholder from './assets/plant-placeholder.svg';

function ProductCard({ plant, inCart, onAdd }) {
  return (
    <article className="plant-card">
      <div className="plant-image-wrap">
        <img
          src={plant.image}
          alt={`${plant.name} houseplant`}
          className="plant-image"
          loading="lazy"
          onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = placeholder; }}
        />
        <span className="plant-category-label">{plant.category}</span>
      </div>
      <div className="plant-card-body">
        <div className="plant-meta">◌ &nbsp;{plant.light}</div>
        <div className="plant-heading-row">
          <h3>{plant.name}</h3>
          <strong className="plant-price">${plant.price.toFixed(2)}</strong>
        </div>
        <p>{plant.note}</p>
        <button
          type="button"
          className={`button button-add ${inCart ? 'is-added' : ''}`}
          onClick={() => onAdd(plant)}
          disabled={inCart}
          aria-label={inCart ? `${plant.name} already added to cart` : `Add ${plant.name} to cart`}
        >
          {inCart ? '✓ Added to cart' : '+ Add to Cart'}
        </button>
      </div>
    </article>
  );
}

export default function ProductList() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const [category, setCategory] = useState('All Plants');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const cartIds = new Set(cartItems.map((item) => item.id));

  const filteredPlants = useMemo(() => {
    const query = search.trim().toLowerCase();
    return plants.filter((plant) =>
      (category === 'All Plants' || plant.category === category) &&
      (plant.name.toLowerCase().includes(query) || plant.category.toLowerCase().includes(query))
    );
  }, [category, search]);

  function handleAdd(plant) {
    dispatch(addItem(plant));
    setNotice(`${plant.name} added to your cart.`);
  }

  return (
    <main id="main-content" className="shop-page">
      <header className="shop-banner">
        <div className="container shop-banner-content">
          <span className="eyebrow eyebrow-light">THE GREENHOUSE EDIT</span>
          <h1>Find your next favorite plant.</h1>
          <p>Thoughtfully chosen houseplants, perfect for every space and every plant parent.</p>
          <span className="shop-count">18 happy plants · 3 collections</span>
        </div>
      </header>
      <section className="container catalog-section" aria-labelledby="catalog-heading">
        <div className="catalog-topbar">
          <div>
            <span className="eyebrow">BROWSE THE COLLECTION</span>
            <h2 id="catalog-heading">Plants with personality</h2>
            <p>Find something that grows with you.</p>
          </div>
          <label className="search-box">
            <span className="sr-only">Search plants</span>
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search houseplants..."
            />
          </label>
        </div>
        <div className="filter-row" role="group" aria-label="Filter plants by category">
          {['All Plants', ...categories].map((option) => (
            <button
              type="button"
              key={option}
              className={`filter-chip ${category === option ? 'active' : ''}`}
              onClick={() => setCategory(option)}
              aria-pressed={category === option}
            >
              {option}
            </button>
          ))}
          <span className="results-count">{filteredPlants.length} plants</span>
        </div>
        {notice && (
          <div className="cart-notice" role="status">
            <span>{notice}</span>
            <Link to="/cart">View cart →</Link>
            <button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification">×</button>
          </div>
        )}
        {filteredPlants.length > 0 ? (
          <div className="plant-grid">
            {filteredPlants.map((plant) => (
              <ProductCard
                key={plant.id}
                plant={plant}
                inCart={cartIds.has(plant.id)}
                onAdd={handleAdd}
              />
            ))}
          </div>
        ) : (
          <div className="empty-results">
            <h3>No plants found</h3>
            <p>Try another search or choose a different category.</p>
            <button type="button" className="button button-dark" onClick={() => { setCategory('All Plants'); setSearch(''); }}>
              Show all plants
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
