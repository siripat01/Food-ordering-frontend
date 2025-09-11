import axios from "axios";

axios.defaults.baseURL = "https://e74f1c92b188.ngrok-free.app/api"

axios.defaults.withCredentials = true;

export default axios;