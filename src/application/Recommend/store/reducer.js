/* reducer负责实施对状态的更改 */
import * as actionTypes from './constants';
import { fromJS } from 'immutable';// 这里用到 fromJS 把 JS 数据结构转化成 immutable 数据结构
//在immutable.js中，object经过fromjs函数以后默认转成map，
//array经过fromjs以后默认转成list
const defaultState = fromJS ({
  bannerList: [],
  recommendList: [],
});

export default (state = defaultState, action) => {
    switch (action.type) {
      case actionTypes.CHANGE_BANNER:
        return state.set ('bannerList', action.data);
      case actionTypes.CHANGE_RECOMMEND_LIST:
        return state.set ('recommendList', action.data);
      default:
        return state;
    }
  }