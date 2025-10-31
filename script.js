const products = [
  { name: "Men’s Jacket", category: "men", size: "L", color: "black", price: 25000, image: "https://picsum.photos/200/300?1" },
  { name: "Women’s T-Shirt", category: "women", size: "M", color: "white", price: 18000, image: "https://picsum.photos/200/300?2" },
  { name: "Men’s Sneakers", category: "men", size: "M", color: "red", price: 30000, image: "https://picsum.photos/200/300?3" },
  { name: "Ladies Handbag", category: "accessories", size: "M", color: "blue", price: 22000, image: "https://picsum.photos/200/300?4" },
  { name: "Sunglasses", category: "accessories", size: "S", color: "black", price: 12000, image: "https://picsum.photos/200/300?5" },
  { name: "Men’s Hoodie", category: "men", size: "L", color: "white", price: 27000, image: "https://picsum.photos/200/300?6" },
  { name: "Women’s Dress", category: "women", size: "S", color: "red", price: 35000, image: "https://picsum.photos/200/300?7" },
  { 
    name: "Men’s Denim Jeans", 
    category: "men", 
    size: "M", 
    color: "blue", 
    price: 32000, 
    image: "https://picsum.photos/200/300?8"
  },

  // New one for Women’s category
  {
    name: "Women’s Sneakers",
    category: "women",
    size: "L",
    color: "white",
    price: 28000,
    image: "https://picsum.photos/200/300?9"
  },

  // Accessories
  {
    name: "Leather Wristwatch",
    category: "accessories",
    size: "M",
    color: "brown",
    price: 15000,
    image: "https://picsum.photos/200/300?10"
  }
];

const productList = document.getElementById('productList');
const categoryButtons = document.querySelectorAll('.category');
const searchInput = document.getElementById('searchInput');
const sizeFilter = document.getElementById('sizeFilter');
const colorFilter = document.getElementById('colorFilter');
const cartCount = document.getElementById('cartCount');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

function renderProducts(filteredProducts) {
  productList.innerHTML = '';
  filteredProducts.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>Size: ${p.size} | Color: ${p.color}</p>
      <p><strong>₦${p.price.toLocaleString()}</strong></p>
      <button class="add-to-cart">Add to Cart</button>
    `;
    div.querySelector('.add-to-cart').addEventListener('click', () => addToCart(p));
    productList.appendChild(div);
  });
}

function addToCart(product) {
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${product.name} added to cart 🛒`);
}

function updateCartCount() {
  if (cartCount) cartCount.textContent = cart.length;
}

function applyFilters() {
  let filtered = products;

  const searchTerm = searchInput.value.toLowerCase();
  const selectedSize = sizeFilter.value;
  const selectedColor = colorFilter.value;
  const activeCategory = document.querySelector('button.category.active')?.dataset.category || 'all';

  if (activeCategory !== 'all') filtered = filtered.filter(p => p.category === activeCategory);
  if (selectedSize !== 'all') filtered = filtered.filter(p => p.size === selectedSize);
  if (selectedColor !== 'all') filtered = filtered.filter(p => p.color === selectedColor);
  if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));

  renderProducts(filtered);
}

// Event listeners
categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  });
});

searchInput.addEventListener('input', applyFilters);
sizeFilter.addEventListener('change', applyFilters);
colorFilter.addEventListener('change', applyFilters);

// Initial render
renderProducts(products);

function payWithPaystack() {
  fetch('https://your-render-backend-url.onrender.com/pay', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: 'customer@example.com',
      amount: 10000
    })
  })
  .then(res => res.json())
  .then(data => {
    const handler = PaystackPop.setup({
      key: 'pk_test_your_public_key',
      email: 'customer@example.com',
      amount: 10000 * 100,
      ref: '' + Math.floor((Math.random() * 1000000000) + 1),
      onClose: () => alert('Payment window closed'),
      callback: (response) => {
        alert('Payment successful! Ref: ' + response.reference);
      }
    });
    handler.openIframe();
  });
}

document.getElementById("payBtn").addEventListener("click", payWithPaystack);
