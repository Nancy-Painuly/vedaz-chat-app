import axios from "axios";
import { BASE_URL } from "../config";

export const registerUser = (userData) =>
  axios.post(`${BASE_URL}/auth/register`, userData);
export const loginUser = (userData) =>
  axios.post(`${BASE_URL}/auth/login`, userData);
export const getUsers = () => axios.get(`${BASE_URL}/users`);
