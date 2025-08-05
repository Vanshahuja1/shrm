import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "https://shrm-backend.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios Error:", error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default axiosInstance
