const form = document.getElementById('itemForm');
const list = document.getElementById('items');

// Fetch and render all items
function loadItems() {
    fetch('/api/items')
        .then(res => res.json())
        .then(items => {
            list.innerHTML = '';
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.name;
                list.appendChild(li);
            });
        });
}

// Handle form submit
form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    if (!name) return;
    fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
        .then(res => res.json())
        .then(() => {
            form.reset();
            loadItems();
        });
});

// Initial load
loadItems();
