// admin-dashboard.js

async function loadDashboard() {

  const res = await api("getStats");

  document.getElementById("stats").innerHTML = `
    <div class="card">Products: ${res.stats.totalProducts}</div>
    <div class="card">Users: ${res.stats.totalUsers}</div>
    <div class="card">Orders: ${res.stats.totalOrders}</div>
    <div class="card">Revenue: $${res.stats.totalRevenue}</div>
  `;
}

async function loadUsers() {
  const res = await api("getUsers");

  document.getElementById("userPanel").innerHTML =
    res.users.map(u => `
      <div class="card">
        <b>${u.name}</b><br>
        ${u.email}<br>
        Role: ${u.role}
      </div>
    `).join("");
}

async function loadOrders() {
  const res = await api("getAllOrders");

  document.getElementById("orderPanel").innerHTML =
    res.orders.map(o => `
      <div class="card">
        Order: ${o.id}<br>
        Total: $${o.total}<br>
        Status: ${o.status}
        <button onclick="dispatch('${o.id}')">Dispatch</button>
      </div>
    `).join("");
}

// UI SWITCH
function show(section) {

  document.querySelectorAll('.main > div')
    .forEach(d => d.style.display = "none");

  document.getElementById(section).style.display = "block";

  if (section === "dashboard") loadDashboard();
  if (section === "users") loadUsers();
  if (section === "orders") loadOrders();
}

// DISPATCH SYSTEM
async function dispatch(orderId) {

  await api("updateOrderStatus", {
    orderId,
    status: "dispatched"
  });

  alert("Order dispatched");
  loadOrders();
}

loadDashboard();