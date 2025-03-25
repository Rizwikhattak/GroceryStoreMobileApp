import Constants from "expo-constants";
import axios from "axios";
const { apiUrl } = Constants.expoConfig.extra;
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
  (config) => {
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
  (config) => {
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
