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

/*  axios使用步骤：
    1.创建一个axios实例并配置axios相关属性，export出去以供调用
    2.调用上一步创建好的axios实例，使用它的get，post...方法
    3.可以设置拦截器在axios请求发出前和接收后对数据进行处理
*/