import React from 'react';

const commitments = [
  {
    icon: '✦',
    title: 'Handpicked with care',
    text: 'Every plant in our collection is selected to make home feel a little more alive.',
  },
  {
    icon: '♡',
    title: 'Growing together',
    text: 'We help beginners and plant enthusiasts find greenery that fits their lifestyle.',
  },
  {
    icon: '☼',
    title: 'A little more green',
    text: 'Our mission is simple: brighten everyday spaces, one happy leaf at a time.',
  },
];

export default function AboutUs() {
  return (
    <section id="about" className="about-section container" aria-labelledby="about-heading">
      <div className="section-heading center">
        <span className="eyebrow">OUR STORY</span>
        <h2 id="about-heading">Rooted in a love for nature.</h2>
        <p>
          Welcome to <strong>Paradise Nursery</strong>, an online plant shop dedicated to
          bringing the beauty and calm of nature into your home. We believe every
          corner deserves a little green, whether you are starting your first
          collection or growing a jungle of your own.
        </p>
      </div>
      <div className="benefits-grid">
        {commitments.map((item) => (
          <article className="benefit-card" key={item.title}>
            <span className="benefit-icon" aria-hidden="true">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
