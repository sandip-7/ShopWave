let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

fetch("data/products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts(products);
  });

function renderProducts(list) {
  const container = document.getElementById("productList");
  container.innerHTML = "";

  list.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}" />
        
        <h3 onclick="viewProduct(${p.id})">${p.name}</h3>
        <p>${p.category}</p>
        <p>$${p.price}</p>

        <button onclick="addToCart(${p.id})">Add to Cart</button>
        <button onclick="addToWishlist(${p.id})">Wishlist ❤️</button>
        <button onclick="viewProduct(${p.id})">View</button>
      </div>
    `;
  });
}