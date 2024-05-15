import axios from 'axios';
import {apiUrl} from "./constants";

export const addInterceptors = (store) => {
  axiosApi.interceptors.request.use((config) => {
    const { url } = config;
    const isSignUp = url?.includes("/user/register");
    const isSignIn = url?.includes("/user/login");
    if (!isSignUp && !isSignIn) {
      const token = store.getState().userState.user;
      const headers = config.headers;
      headers.set('Authorization', `Token ${token}`);
    }
    return config;
  });
};

const axiosApi = axios.create({
  baseURL: apiUrl,
});

export default axiosApi;
