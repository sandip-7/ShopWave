const products = [
  { id: 1, name: "T-Shirt", price: 20 },
  { id: 2, name: "Shoes", price: 50 },
  { id: 3, name: "Watch", price: 100 }
];

function loadProducts() {
  const container = document.getElementById("productList");

  container.innerHTML = products.map(p => `
    <div class="card">
      <h3>${p.name}</h3>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
      <button onclick="addToWishlist(${p.id})">Wishlist</button>
    </div>
  `).join("");
}

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}

function addToWishlist(id) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist.push(id);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  alert("Added to wishlist");
}

loadProducts();