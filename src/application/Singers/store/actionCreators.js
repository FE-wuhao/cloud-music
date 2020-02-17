import {
  getHotSingerListRequest,
  getSingerListRequest
} from "../../../api/request";
import {
  CHANGE_SINGER_LIST,
  CHANGE_CATOGORY,
  CHANGE_ALPHA,
  CHANGE_PAGE_COUNT,
  CHANGE_PULLUP_LOADING,
  CHANGE_PULLDOWN_LOADING,
  CHANGE_ENTER_LOADING
} from './constants';
import {
  fromJS
} from 'immutable';


const changeSingerList = (data) => ({
  type: CHANGE_SINGER_LIST,
  data: fromJS(data)
});
export const changePageCount = (data) => ({
  type: CHANGE_PAGE_COUNT,
  data
});
//进场loading
export const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data
});
//滑动最底部loading
export const changePullUpLoading = (data) => ({
  type: CHANGE_PULLUP_LOADING,
  data
});
//顶部下拉刷新loading
export const changePullDownLoading = (data) => ({
  type: CHANGE_PULLDOWN_LOADING,
  data
});

//加载热门歌手
export const getHotSingerList = () => {
  return (dispatch) => {
    getHotSingerListRequest(0).then(res => {
      const data = res.artists;
      dispatch(changeSingerList(data));
      dispatch(changeEnterLoading(false));
      dispatch(changePullDownLoading(false));
    }).catch(() => {
      console.log('热门歌手数据获取失败');
    })
  }
};

//加载对应类别的歌手
export const getSingerList = (category, alpha) => {
  return (dispatch, getState) => {
    getSingerListRequest(category, alpha, 0).then(res => {
      const data = res.artists;
      dispatch(changeSingerList(data));
      dispatch(changeEnterLoading(false));
      dispatch(changePullDownLoading(false));
    }).catch(() => {
      console.log('歌手数据获取失败');
    });
  }
};

//加载更多热门歌手
export const refreshMoreHotSingerList = () => {
  return (dispatch, getState) => {
    const pageCount = getState().getIn(['singers', 'pageCount']);//获取当前的页码（已经+1过了，但尚未获取到相应的歌手列表数据）
    const singerList = getState().getIn(['singers', 'singerList']).toJS();//获取当前的歌手列表
    getHotSingerListRequest(pageCount).then(res => {//根据当前的页码抓取相应的歌手列表
      const data = [...singerList, ...res.artists];//将歌手清单的历史数据与获取到的新一页的歌手数据合并
      dispatch(changeSingerList(data));//将歌手清单存入store
      dispatch(changePullUpLoading(false));//将加载中状态清空
    }).catch(() => {
      console.log('热门歌手数据获取失败');
    });
  }
};

//加载更多歌手
export const refreshMoreSingerList = (category, alpha) => {
  return (dispatch, getState) => {
    const pageCount = getState().getIn(['singers', 'pageCount']);
    const singerList = getState().getIn(['singers', 'singerList']).toJS();
    getSingerListRequest(category, alpha, pageCount).then(res => {
      const data = [...singerList, ...res.artists];
      dispatch(changeSingerList(data));
      dispatch(changePullUpLoading(false));
    }).catch(() => {
      console.log('歌手数据获取失败');
    });
  }
};