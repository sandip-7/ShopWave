function addToWishlist(id) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (!wishlist.includes(id)) {
    wishlist.push(id);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  alert("Added to wishlist ❤️");
}