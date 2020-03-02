import { axiosInstance } from "./config";

export const getBannerRequest = () => {
  return axiosInstance.get ('/banner');
}

export const getRecommendListRequest = () => {
  return axiosInstance.get ('/personalized');
}

export const getHotSingerListRequest = (count) => {
  return axiosInstance.get(`/top/artists?offset=${count}`);
}
//cat：歌手类型  initial：名字首字母  offset : 偏移数量，用于分页 
export const getSingerListRequest= (category, alpha, count) => {
  return axiosInstance.get(`/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`);
}
//请求排行榜所需数据资源
export const getRankListRequest = () => {
  return axiosInstance.get (`/toplist/detail`);
};
//根据歌单ID获取歌单资源
export const getAlbumDetailRequest = id => {
  return axiosInstance.get (`/playlist/detail?id=${id}`);
};
//根据歌手id获取歌单资源
export const getSingerInfoRequest = id => {
  return axiosInstance.get (`/artists?id=${id}`);
};

export const getLyricRequest = id => {
  return axiosInstance.get (`/lyric?id=${id}`);
};