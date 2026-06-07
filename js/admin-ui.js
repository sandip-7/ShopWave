/* =========================================================
   GLOBAL STATE
========================================================= */

let selectedProduct = null;

/* =========================================================
   PAGE SWITCHER
========================================================= */

function show(page) {

  console.log("Switching page:", page);

  document.querySelectorAll(".page")
    .forEach(p => p.classList.add("hidden"));

  const el = document.getElementById(page);

  if (!el) {
    console.error("Page not found:", page);
    return;
  }

  el.classList.remove("hidden");

  if (page === "dashboard") {
  loadStats();
  loadActivity(); //
}
  if (page === "products") loadProducts();
  if (page === "inventory") loadInventory();
  if (page === "users") loadUsers();
  if (page === "orders") loadOrders();

  // ✅ ADD THIS LINE
  if (page === "trending") loadTrending();
}

/* =========================================================
   DASHBOARD
========================================================= */

async function loadStats() {

  const res = await api("getStats");

  console.log("STATS RESPONSE:", res);

  if (!res?.success) return;

  document.getElementById("pCount").innerText = res.stats.totalProducts;
  document.getElementById("uCount").innerText = res.stats.totalUsers;
  document.getElementById("oCount").innerText = res.stats.totalOrders;
  document.getElementById("rCount").innerText = res.stats.totalRevenue;
}

/* =========================================================
   USERS
========================================================= */

async function loadUsers() {
  try {
    const res = await api("getUsers");
    const users = res?.users || [];

    document.getElementById("userList").innerHTML =
      users.map(u => `
        <div class="item">
          <b>${u.name}</b><br>
          ${u.email}<br>
          Role: ${u.role}
        </div>
      `).join("");

  } catch (err) {
    console.error(err);
  }
}

/* =========================================================
   PRODUCTS
========================================================= */

async function loadProducts() {
  try {
    const res = await api("getProducts");
    const products = res?.products || [];

    document.getElementById("productList").innerHTML =
      products.map(p => `
        <div class="item" style="display:flex; gap:12px; align-items:center;">

          <!-- ✅ PRODUCT IMAGE -->
          <img src="${p.image || 'https://via.placeholder.com/70'}"
               style="width:70px; height:70px; object-fit:cover; border-radius:6px;"
               onerror="this.src='https://via.placeholder.com/70'">

          <!-- PRODUCT INFO -->
          <div style="flex:1">
            <b>${p.name}</b><br>
            ₹${p.price}<br>
            Stock: ${p.stock}
          </div>

          <!-- ACTIONS -->
          <div style="display:flex; flex-direction:column; gap:5px">

            <button onclick='openEditProduct(${JSON.stringify(p)})'>
              Edit
            </button>

            <button onclick="deleteProductUI('${p.id}')">
              Delete
            </button>

            <button onclick="toggleTrending('${p.id}', '${p.trending}')">
              ${p.trending === "true" ? "🔥 Remove" : "🔥 Trending"}
            </button>

          </div>

        </div>
      `).join("");

  } catch (err) {
    console.error("loadProducts error:", err);
  }
}

/* =========================================================
   ADD PRODUCT MODAL
========================================================= */

function openAddForm() {
  document.getElementById("addModal").classList.remove("hidden");
}

function closeAddForm() {
  document.getElementById("addModal").classList.add("hidden");
  clearAddForm();
}

function clearAddForm() {
  ["add_name","add_price","add_discount","add_stock","add_image","add_desc"]
    .forEach(id => document.getElementById(id).value = "");
}

/* =========================================================
   SAVE PRODUCT (CREATE)
========================================================= */

async function saveProduct() {

  const data = {
    id: "p" + Date.now(),
    name: document.getElementById("add_name").value,
    price: document.getElementById("add_price").value,
    discount: document.getElementById("add_discount").value,
    stock: document.getElementById("add_stock").value,
    image: document.getElementById("add_image").value,
    description: document.getElementById("add_desc").value
  };

  if (!data.name || !data.price) {
    alert("Name and Price required");
    return;
  }

  try {
    const res = await api("addProduct", data);

    if (!res?.success) {
      alert(res?.error || "Failed to add product");
      return;
    }

    alert("Product added ✅");
    closeAddForm();
    loadProducts();

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

/* =========================================================
   EDIT PRODUCT MODAL
========================================================= */

function openEditProduct(p) {

  selectedProduct = p;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val ?? "";
  };

  document.getElementById("editModal").classList.remove("hidden");

  set("edit_id", p.id);
  set("edit_name", p.name);
  set("edit_price", p.price);
  set("edit_discount", p.discount);
  set("edit_stock", p.stock);
  set("edit_image", p.image);
  set("edit_desc", p.description);
}

function closeEditModal() {
  document.getElementById("editModal").classList.add("hidden");
}

/* =========================================================
   UPDATE PRODUCT
========================================================= */

async function saveUpdate() {

  const get = (id) => {
    const el = document.getElementById(id);
    if (!el) {
      console.error("Missing element:", id);
      return "";
    }
    return el.value;
  };

  const data = {
    id: get("edit_id"),
    name: get("edit_name"),
    price: get("edit_price"),
    discount: get("edit_discount"),
    stock: get("edit_stock"),
    image: get("edit_image"),
    description: get("edit_desc")
  };

  console.log("Updating product:", data);

  const res = await api("updateProduct", data);

  if (!res.success) {
    alert(res.error);
    return;
  }

  alert("Updated ✅");
  closeEditModal();
  loadProducts();
}

/* =========================================================
   DELETE PRODUCT
========================================================= */

async function deleteProductUI(id) {

  if (!confirm("Are you sure to delete this product?")) return;

  try {
    const res = await api("deleteProduct", { id });

    if (!res?.success) {
      alert(res?.error || "Delete failed");
      return;
    }

    loadProducts();

  } catch (err) {
    console.error(err);
  }
}

/* =========================================================
   ORDERS
========================================================= */

async function loadOrders() {

  try {
    const res = await api("getAllOrders");
    const orders = res?.orders || [];

    document.getElementById("orderList").innerHTML =
      orders.map(o => `
        <div class="item">
          <div>
            Order: ${o.id}<br>
            ₹${o.total}
          </div>

          <button onclick="dispatch('${o.id}')">
            Dispatch
          </button>
        </div>
      `).join("");

  } catch (err) {
    console.error(err);
  }
}

/* =========================================================
   DISPATCH ORDER
========================================================= */

async function dispatch(id) {

  try {
    await api("updateOrderStatus", {
      orderId: id,
      status: "dispatched"
    });

    loadOrders();

  } catch (err) {
    console.error(err);
  }
}

/* =========================================================
   loadactivity
========================================================= */

async function loadActivity() {

  const productRes = await api("getProducts");
  const ordersRes = await api("getAllOrders");

  const products = productRes.products || [];
  const orders = ordersRes.orders || [];

  // last 5 products
  const latestProducts = products.slice(-5).reverse();

  // last 5 orders
  const latestOrders = orders.slice(-5).reverse();

  document.getElementById("activityBox").innerHTML = `
    <h3>🔥 Recent Activity</h3>

    <h4>🆕 New Products</h4>
    ${latestProducts.map(p => `
      <div class="item">
        🆕 ${p.name} - ₹${p.price}
      </div>
    `).join("")}

    <h4>🛒 Recent Orders</h4>
    ${latestOrders.map(o => `
      <div class="item">
        Order: ${o.id} - ₹${o.total}
      </div>
    `).join("")}
  `;
}

/* =========================================================
   TRENDING
========================================================= */
async function loadTrending() {

  const res = await api("getTrendingProducts");
  const products = res.products || [];

  document.getElementById("trendingBox").innerHTML =
    products.map(p => `
      <div class="item" style="display:flex; gap:10px; align-items:center;">

        <img src="${p.image}" 
             style="width:70px;height:70px;object-fit:cover;border-radius:6px"
             onerror="this.src='https://via.placeholder.com/70'">

        <div>
          <b>🔥 ${p.name}</b><br>
          ₹${p.price}
        </div>

      </div>
    `).join("");
}





async function loadInventory() {

  console.log("📦 Loading inventory...");

  try {

    const res = await api("getProducts");

    console.log("Inventory API response:", res);

    if (!res || !res.success) {
      document.getElementById("inventoryBox").innerHTML =
        `<p style="color:red">Failed to load inventory</p>`;
      return;
    }

    const products = res.products || [];

    if (products.length === 0) {
      document.getElementById("inventoryBox").innerHTML =
        `<p>No products found</p>`;
      return;
    }

    document.getElementById("inventoryBox").innerHTML = `
      <table class="table">

        <thead>
          <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Update</th>
          </tr>
        </thead>

        <tbody>
          ${products.map(p => `
            <tr>
              <td>${p.name}</td>

              <td>
                <input 
                  type="number" 
                  value="${p.stock || 0}" 
                  id="stock_${p.id}"
                >
              </td>

              <td>
                <button onclick="updateStock('${p.id}')">
                  Save
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>

      </table>
    `;

  } catch (err) {
    console.error("Inventory error:", err);
  }
}
async function updateStock(id) {

  const stock = document.getElementById(`stock_${id}`).value;

  const res = await api("updateProduct", {
    id,
    stock
  });

  console.log("Stock update response:", res);

  if (!res.success) {
    alert(res.error);
    return;
  }

  alert("Stock updated ✅");
}
async function toggleTrending(id) {

  const res = await api("toggleTrending", { id });

  console.log("Trending:", res);

  if (!res.success) {
    alert(res.error || "Failed");
    return;
  }

  loadProducts();
  loadTrending();
}

// async function loadTrending() {

//   try {
//     const res = await api("getTrendingProducts");

//     if (!res?.success) {
//       document.getElementById("trendingBox").innerHTML =
//         "<p style='color:red'>Failed to load trending</p>";
//       return;
//     }

//     const products = res.products || [];

//     if (products.length === 0) {
//       document.getElementById("trendingBox").innerHTML =
//         "<p>No trending products yet 🔥</p>";
//       return;
//     }

//     document.getElementById("trendingBox").innerHTML =
//       products.map(p => `
//         <div class="item">
//           🔥 <b>${p.name}</b><br>
//           ₹${p.price}
//         </div>
//       `).join("");

//   } catch (err) {
//     console.error("Trending load error:", err);
//   }
// }

async function toggleTrending(id, current) {

  const newValue = current === "true" ? "false" : "true";

  const res = await api("toggleTrending", {
  id
});

  if (res.success) {
    alert("Trending updated ✅");
    loadProducts();
  } else {
    alert("Failed to update trending");
  }
}
