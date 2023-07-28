import axios from "axios";

export default axios.create({
  baseURL: "http://192.168.20.30:55555/api",
  headers: {
    "Content-type": "application/json"
  }
});