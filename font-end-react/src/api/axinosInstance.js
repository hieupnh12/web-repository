import axios from "axios";

const BASE_URL = axios.create({
  // http://localhost:3004/
  // http://localhost:8080/warehouse
  baseURL: "http://localhost:8080/warehouse",
  headers: {
    "Content-Type": "application/json",
  },
});

export default BASE_URL;
