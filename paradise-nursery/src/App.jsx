import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import AboutUs from './AboutUs.jsx';
import ProductList, { Navbar } from './ProductList.jsx';
import CartItem from './CartItem.jsx';

function Home() {
  return (
    <main id="main-content">
      <section className="hero" aria-labelledby="hero-heading">
        <div className="container hero-content">
          <span className="hero-kicker">WELCOME TO PARADISE NURSERY</span>
          <h1 id="hero-heading">A greener home<br />starts <em>here.</em></h1>
          <p>Beautiful houseplants for brighter spaces and happier days. Find your perfect green companion.</p>
          <Link to="/plants" className="button button-cream">Get Started <span aria-hidden="true">↗</span></Link>
          <div className="hero-caption"><span aria-hidden="true">✦</span> &nbsp;Good things grow here.</div>
        </div>
        <div className="hero-side-label" aria-hidden="true">NURTURE YOUR NATURE / EST. 2026</div>
      </section>
      <div className="promise-strip" aria-label="Our promises">
        <div className="container promise-inner">
          <span>✷ &nbsp;Curated houseplants</span>
          <span>✳ &nbsp;For every kind of home</span>
          <span>✿ &nbsp;Grown with love</span>
        </div>
      </div>
      <AboutUs />
      <section className="home-cta container">
        <div><span className="eyebrow">READY TO GROW?</span><h2>Make room for something beautiful.</h2></div>
        <Link to="/plants" className="button button-cream">Shop the collection ↗</Link>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/plants" element={<ProductList />} />
        <Route path="/cart" element={<CartItem />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <footer className="site-footer">
        <div className="container footer-inner">
          <span className="footer-brand">✿ &nbsp;paradisenursery.</span>
          <span>Made for plant lovers, everywhere.</span>
          <span>© 2026 Paradise Nursery</span>
        </div>
      </footer>
    </div>
  );
}
