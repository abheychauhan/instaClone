import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000"
});

// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (
//       error.response &&
//       [401, 403, 500].includes(error.response.status)
//     ) {
//       window.location.href = '/'; // or '/login'
//     }
//     return Promise.reject(error);
//   }
// );


export default instance;
