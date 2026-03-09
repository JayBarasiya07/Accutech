import axios from "axios";

const API = "http://localhost:8000/api/products";

export const getProducts = async (token) => {
  return axios.get(API, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getProductById = async (id, token) => {
  return axios.get(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const createProduct = async (data, token) => {
  return axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });
};

export const updateProduct = async (id, data, token) => {
  return axios.put(`${API}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });
};

export const deleteProduct = async (id, token) => {
  return axios.delete(`${API}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};