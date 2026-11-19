// Each category contains six distinct houseplants, as required by the project rubric.
const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=85`;

export const categories = ['Air Purifying', 'Low Maintenance', 'Tropical Favorites'];

export const plants = [
  { id: 1, name: 'Snake Plant', category: 'Air Purifying', price: 18, image: photo('photo-1593482892290-f54927ae1bb6'), light: 'Low to bright light', note: 'Bold, upright leaves that thrive on neglect.' },
  { id: 2, name: 'Peace Lily', category: 'Air Purifying', price: 24, image: photo('photo-1497250681960-ef046c08a56e'), light: 'Indirect sunlight', note: 'Lush green foliage and elegant white blooms.' },
  { id: 3, name: 'Spider Plant', category: 'Air Purifying', price: 16, image: photo('photo-1459156212016-c812468e2115'), light: 'Bright indirect light', note: 'Playful cascading leaves for a fresh corner.' },
  { id: 4, name: 'Boston Fern', category: 'Air Purifying', price: 22, image: photo('photo-1501004318641-b39e6451bec6'), light: 'Indirect light', note: 'A feathery burst of beautiful greenery.' },
  { id: 5, name: 'Rubber Plant', category: 'Air Purifying', price: 29, image: photo('photo-1485955900006-10f4d324d411'), light: 'Medium indirect light', note: 'Glossy, sculptural leaves with a rich finish.' },
  { id: 6, name: 'Areca Palm', category: 'Air Purifying', price: 34, image: photo('photo-1525498128493-380d1990a112'), light: 'Bright indirect light', note: 'Soft palm fronds with a tropical feeling.' },
  { id: 7, name: 'ZZ Plant', category: 'Low Maintenance', price: 21, image: photo('photo-1545241047-6083a3684587'), light: 'Low light friendly', note: 'Resilient glossy leaves for busy days.' },
  { id: 8, name: 'Jade Plant', category: 'Low Maintenance', price: 15, image: photo('photo-1483794344563-d27a8d18014e'), light: 'Bright sunlight', note: 'A cheerful succulent with thick rounded leaves.' },
  { id: 9, name: 'Aloe Vera', category: 'Low Maintenance', price: 17, image: photo('photo-1509423350716-97f9360b4e09'), light: 'Bright light', note: 'Architectural leaves in a compact pot.' },
  { id: 10, name: 'Ponytail Palm', category: 'Low Maintenance', price: 26, image: photo('photo-1542728928-1413d1894ed1'), light: 'Bright light', note: 'A quirky statement with flowing strands.' },
  { id: 11, name: 'Haworthia', category: 'Low Maintenance', price: 13, image: photo('photo-1515616197295-92c4fa96810b'), light: 'Indirect sunlight', note: 'A small succulent with striking leaf patterns.' },
  { id: 12, name: 'Echeveria', category: 'Low Maintenance', price: 14, image: photo('photo-1459156212016-c812468e2115'), light: 'Full to partial sun', note: 'A delicate rosette, perfect for sunny shelves.' },
  { id: 13, name: 'Monstera Deliciosa', category: 'Tropical Favorites', price: 38, image: photo('photo-1509423350716-97f9360b4e09'), light: 'Bright indirect light', note: 'Iconic split leaves for instant jungle vibes.' },
  { id: 14, name: 'Golden Pothos', category: 'Tropical Favorites', price: 19, image: photo('photo-1497250681960-ef046c08a56e'), light: 'Low to bright indirect', note: 'An easy trailing vine with golden highlights.' },
  { id: 15, name: 'Heartleaf Philodendron', category: 'Tropical Favorites', price: 23, image: photo('photo-1525498128493-380d1990a112'), light: 'Indirect sunlight', note: 'Lovely heart-shaped leaves in lush green.' },
  { id: 16, name: 'Bird of Paradise', category: 'Tropical Favorites', price: 46, image: photo('photo-1466692476868-aef1dfb1e735'), light: 'Bright filtered light', note: 'Large dramatic foliage for statement spaces.' },
  { id: 17, name: 'Calathea Orbifolia', category: 'Tropical Favorites', price: 32, image: photo('photo-1530968464165-7a1861cbaf9f'), light: 'Medium indirect light', note: 'Elegant striped leaves with soft curves.' },
  { id: 18, name: 'Fiddle-Leaf Fig', category: 'Tropical Favorites', price: 42, image: photo('photo-1485955900006-10f4d324d411'), light: 'Bright indirect light', note: 'Tall leafy charm for your favorite room.' },
];
