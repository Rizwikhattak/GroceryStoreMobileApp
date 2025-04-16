import { axiosForm, axiosJSON } from "./Axios";

export const API_COMMON = async (
  METHOD,
  type = "json",
  URL,
  ERROR_MESSAGE = "Error Making Request",
  DATA = null
) => {
  try {
    switch (METHOD) {
      case "post": {
        const response =
          type === "form"
            ? await axiosForm.post(URL, DATA)
            : await axiosJSON.post(URL, DATA);
        return response.data;
      }
      case "patch": {
        const response =
          type === "form"
            ? await axiosForm.patch(URL, DATA)
            : await axiosJSON.patch(URL, DATA);
        return response.data;
      }
      case "put": {
        const response =
          type === "form"
            ? await axiosForm.put(URL, DATA)
            : await axiosJSON.put(URL, DATA);
        return response.data;
      }
      case "getAll": {
        const response = await axiosJSON.get(URL);
        return response.data;
      }
      case "delete": {
        const response = await axiosJSON.delete(URL);
        return response.data;
      }
      case "auth": {
        const response = await axiosJSON.post(URL, DATA);
        return response.data;
      }
      default: {
        console.error("Enter a valid method");
        return null;
      }
    }
  } catch (error) {
    const message = error.response?.data?.message || ERROR_MESSAGE; // Extracting the message from backend
    console.error("API Error:", message);
    return Promise.reject({ message });
  }
};
