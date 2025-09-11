import axios from "axios";

const api = axios.create({
  baseURL: "https://d19b55b1af62.ngrok-free.app/api",
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": true,
    // "User-Agent": "MyCustomClient/1.0"

  }
});

export default api;