import axios from "axios";

export const  uploadHttp = axios.create({
  baseURL: "http://localhost:8000/",
  timeout: 10000, // Timeout in milliseconds
  headers: {
    "Content-Type": "application/json",
  },
}); 
