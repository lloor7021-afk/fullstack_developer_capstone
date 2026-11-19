const form = document.getElementById('guestbook-form');
const field = document.getElementById('guestbook-entry-content');
const list = document.getElementById('guestbook-entries');

function render(entries) {
  list.replaceChildren();
  for (const entry of entries) {
    const p = document.createElement('p');
    p.textContent = entry;
    list.appendChild(p);
  }
}
async function refresh() {
  const result = await fetch('/lrange/guestbook');
  if (result.ok) render(await result.json());
}
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = field.value.trim();
  if (!message) return;
  const result = await fetch('/rpush/guestbook/' + encodeURIComponent(message));
  if (result.ok) {
    render(await result.json());
    field.value = '';
  } else {
    alert('Unable to submit the message.');
  }
});
refresh().catch(console.error);
setInterval(() => refresh().catch(console.error), 5000);
