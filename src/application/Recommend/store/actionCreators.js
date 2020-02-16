/* actioncreators和constants是一样东西，都是action，
   存放的是状态处理函数
*/
import * as actionTypes from './constants';
import { fromJS } from 'immutable';// 将 JS 对象转换成 immutable 对象
import { getBannerRequest, getRecommendListRequest } from '../../../api/request';

//写（被调用的子函数）
export const changeBannerList = (data) => ({
  type: actionTypes.CHANGE_BANNER,
  data: fromJS (data)
});

export const changeRecommendList = (data) => ({
  type: actionTypes.CHANGE_RECOMMEND_LIST,
  data: fromJS (data)
});

export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data//这样写也是可以的，get的时候不需要键名就能直接抓到数据了???????????????????????为什么这里不需要转成immutable的格式？？？？？？？？？？？？？？？？？、
});

//请求数据
//这里用到了thunk，大致过程是在mapDispatchToProps的时候将dispatch传入了getBannerList中，等到异步数据回来后再调用dispatch，使得reducer将数据写入store中
//需要做的就是在actioncreator中返回一个异步函数，该函数的形参为dispatch，在connect映射的时候mapDispatchToProps会将dispatch传入
//但只是暂时的一个意会式的理解  等到项目整体搭建完成后再来深究原理
export const getBannerList = () => {
  return (dispatch) => {
    getBannerRequest ().then (data => {
      dispatch (changeBannerList (data.banners));
    }).catch (() => {
      console.log ("轮播图数据传输错误");
    }) 
  }
};

// 另外在获取推荐歌单后，应把 loading 状态改为 false
export const getRecommendList = () => {
  return (dispatch) => {
    getRecommendListRequest ().then (data => {
      dispatch (changeRecommendList (data.result));
      dispatch (changeEnterLoading (false));// 改变 loading
    }).catch (() => {
      console.log ("推荐歌单数据传输错误");
    });
  }
};