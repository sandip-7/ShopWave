async function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await api("login", { email, password });

    if (!res || res.success !== true) {
      alert(res?.error || "Invalid email or password");
      return;
    }

    localStorage.setItem("user", JSON.stringify(res.user));

    alert("Login successful");

    if (res.user.role === "admin") {
      window.location.href = "/pages/admin-dashboard.html";
    } else {
      window.location.href = "/pages/products.html";
    }

  } catch (err) {
    console.error(err);
    alert("Server error. Please try again.");
  }
}


/* ================= SIGNUP ================= */

async function signupUser() {
  const name = document.getElementById("name")?.value;
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await api("register", {
      name,
      email,
      password
    });

    if (!res || res.success !== true) {
      alert(res?.error || "Signup failed");
      return;
    }

    alert("Signup successful. Please login now.");
    window.location.href = "/user-login.html";

  } catch (err) {
    console.error(err);
    alert("Server error during signup");
  }
}


/* ================= LOGOUT ================= */

function logout() {
  localStorage.removeItem("user");
  window.location.href = "/user-login.html";
}


/* ================= AUTH GUARD ================= */

function requireAuth(role = null) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "/user-login.html";
    return;
  }

  if (role && user.role !== role) {
    alert("Access denied");
    window.location.href = "/";
  }
}