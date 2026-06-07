const API_URL = "https://script.google.com/macros/s/AKfycbxd3mEKnktbbCgaPr609Zd67DMMlNrIHWzD4oBooYoB4WNYeDT2OmuK05LTVNXexOWU/exec";

async function api(action, params = {}, retries = 2) {

  const url = new URL(API_URL);
  url.searchParams.append("action", action);

  Object.keys(params).forEach(key => {

    let value = params[key];

    // 🔥 FIX: handle objects/arrays
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }

    url.searchParams.append(key, value);
  });

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url.toString(), {
        method: "GET",
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error("HTTP Error: " + response.status);
      }

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Invalid JSON from server: " + text);
      }

      console.log("API SUCCESS:", action, data);

      return data;

    } catch (err) {

      console.warn(`API attempt ${attempt + 1} failed:`, err.message);

      if (attempt === retries) {
        return {
          success: false,
          error: "Server unavailable",
          debug: err.message
        };
      }

      await new Promise(res => setTimeout(res, 800));
    }
  }
}