// src/config/apiConfig.js
const isProduction = process.env.NODE_ENV === 'production';

const API_URL = isProduction
  ? 'https://backend-rdf2.onrender.com/api'
  : 'http://localhost:5000/api';
  console.log("API_URL:", API_URL);


export default API_URL;
