function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const qtyInput = document.getElementById("qty_" + productId);
  const qty = qtyInput ? parseInt(qtyInput.value) : 1;

  let existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty: qty });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}