import axios from "axios";

export const  uploadHttp = axios.create({
  baseURL: "http://localhost:8000/", 
  headers: {
    "Content-Type": "application/json",
  },
}); 
