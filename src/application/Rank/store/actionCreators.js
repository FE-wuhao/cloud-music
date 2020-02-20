import { fromJS } from 'immutable';
import {CHANGE_RANK_LIST,CHANGE_LOADING} from './constants'
import { getRankListRequest } from '../../../api/request';

const changeRankList = (data) => ({
    type: CHANGE_RANK_LIST,
    data: fromJS (data)
  })
  
const changeLoading = (data) => ({
type: CHANGE_LOADING,
data
})
  
export const getRankList = () => {
return dispatch => {
  //发出排行榜数据请求
    getRankListRequest ().then (data => {
      /*
      只要“&&”前面是false，无论“&&”后面是true还是false，结果都将返“&&”前面的值;
      只要“&&”前面是true，无论“&&”后面是true还是false，结果都将返“&&”后面的值; 
      */
    let list = data && data.list;//data为空则返回data，data不为空则返回data.list
    dispatch (changeRankList (list));//存储歌单数据
    dispatch (changeLoading (false));//接触加载中状态
    })
}
}
  
