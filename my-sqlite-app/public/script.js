loadItems();


const form = document.getElementById('itemForm');
const list = document.getElementById('items');

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

form.addEventListener('submit', e => {
    e.preventDefault();
    const SQL = document.getElementById('name').value.trim();
    console.log(`SQL: `, JSON.stringify({ SQL }));
    
    if (!SQL) return;
    fetch('/api/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ SQL })
    })
        .then(res => res.json())
        .then(() => {
            form.reset();
            loadItems();
        });
});


// INSERT INTO items(name) VALUES('abaa')