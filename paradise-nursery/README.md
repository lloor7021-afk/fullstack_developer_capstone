# Paradise Nursery Shopping Application

**Paradise Nursery** is a responsive React shopping-cart application for an online houseplant store. It provides a landing page with the company name and **Get Started** button, an About Us section, a product catalogue, and a fully interactive shopping cart managed with Redux Toolkit.

## Features

- **Home page** with a full-width plant background image and **Get Started** button.
- **About Us** page content introducing the Paradise Nursery brand.
- **18 unique houseplants**, grouped into **3 categories with 6 plants each**, showing thumbnail images, names and prices.
- **Add to Cart** buttons add plants to Redux state, become disabled for already-added plants, and update the navigation cart quantity instantly.
- **Navigation bar** with Home, Plants and Cart links, present on product and cart pages.
- **Shopping cart** shows a thumbnail, plant name, unit price, line total, total item quantity and full order total.
- **Quantity controls** increase or decrease counts and automatically recalculate totals.
- **Remove item** buttons delete the selected plant from the cart.
- **Checkout** button shows a **Coming Soon** message.
- **Continue Shopping** returns to the plant catalogue.
- Responsive design for desktop, tablet and mobile; cart contents persist in local storage.

## Required submission files

| Task | File | What it does |
|---|---|---|
| 1 | [`README.md`](README.md) | Project name and details |
| 2 | [`src/AboutUs.jsx`](src/AboutUs.jsx) | Company information |
| 3 | [`src/App.css`](src/App.css) | Background image and styles |
| 4 | [`src/App.jsx`](src/App.jsx) | Landing page with Get Started button |
| 5 | [`src/CartSlice.jsx`](src/CartSlice.jsx) | Redux `addItem()`, `removeItem()` and `updateQuantity()` reducers |
| 6 | [`src/ProductList.jsx`](src/ProductList.jsx) | Catalogue, categories, product cards and add-to-cart |
| 7 | [`src/CartItem.jsx`](src/CartItem.jsx) | Complete cart experience and checkout placeholder |

## Run the project

Install Node.js 18+ and execute:

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

For a production bundle:

```bash
npm run build
npm run preview
```

## Project structure

```text
paradise-nursery/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── AboutUs.jsx
    ├── ProductList.jsx
    ├── CartSlice.jsx
    ├── CartItem.jsx
    ├── store.js
    ├── data/plants.js
    └── assets/plant-placeholder.svg
```

## Notes

This project is a client-side educational demo: no payment is processed. Plant photos are loaded from Unsplash; the interface includes an SVG illustration fallback in case a remote photo is unavailable. Prices are illustrative and shown in USD.
