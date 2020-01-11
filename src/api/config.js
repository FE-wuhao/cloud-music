import axios from 'axios';

export const baseUrl = 'http://localhost:3000/';

//axios 的实例及拦截器配置
const axiosInstance = axios.create ({
  baseURL: baseUrl
});
//响应拦截器
axiosInstance.interceptors.response.use (
  res => res.data,//简写体的返回值不用return就可以返回，块体的返回值要return
  err => {
    console.log (err, "网络错误");
  }
);

export {
  axiosInstance
};