function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let item = cart.find(p => p.id === id);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id: id, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}