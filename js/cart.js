// Load cart items from localStorage
function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const container = document.getElementById("cartItems");

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty</p>";
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <p>Product ID: ${item.id}</p>
      <p>Qty: ${item.qty}</p>
      <button onclick="removeItem('${item.id}')">Remove</button>
    </div>
  `).join("");

  calculateTotal(cart);
}

// Remove item
function removeItem(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== id);

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Calculate total (simple demo logic)
function calculateTotal(cart) {
  const total = cart.reduce((sum, item) => sum + (item.qty * 100), 0);

  document.getElementById("total").innerText = "Total: $" + total;
}




async function checkout() {
  const user = JSON.parse(localStorage.getItem("user"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!user) {
    alert("Please login first");
    return;
  }

  const order = {
    userEmail: user.email,
    items: cart,
    total: cart.length * 100
  };

  const res = await api("createOrder", order);

  if (res.success) {
    alert("Order placed successfully!");
    localStorage.removeItem("cart");
    window.location.href = "products.html";
  } else {
    alert("Order failed");
  }
}