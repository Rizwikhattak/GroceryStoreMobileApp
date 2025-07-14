import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const getAuthToken = async () => {
  try {
    const value = await AsyncStorage.getItem("Authorization");
    if (value !== null) {
      return value;
    } else {
      console.log("No data found");
    }
  } catch (e) {
    console.error("Error reading value:", e);
  }
};
const axiosJSON = axios.create({
  baseURL: apiUrl,
  withCredentials: true, //for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosForm = axios.create({
  baseURL: apiUrl,
  withCredentials: true, //for cookies
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

axiosJSON.interceptors.request.use(
  async (config) => {
    console.log("api url", apiUrl);
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosJSON.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

axiosForm.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosForm.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosForm, axiosJSON };
