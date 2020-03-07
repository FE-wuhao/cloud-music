import * as actionTypes from './constants';
import {fromJS} from 'immutable';
import { playMode } from './../../../api/config';
import { findIndex } from '../../../api/utils';//注意引入工具方法

//删除播放列表中的某一项
const handleDeleteSong = (state, song) => {
  //也可用loadsh库的deepClone方法。这里深拷贝是基于纯函数的考虑，不对参数state做修改
  const playList = JSON.parse(JSON.stringify(state.get('playList').toJS()));//当前的播放列表
  const sequenceList = JSON.parse(JSON.stringify(state.get('sequencePlayList').toJS()));//当前的播放顺序表
  let currentIndex = state.get('currentIndex');//当前播放播放的曲目索引

  const fpIndex = findIndex(song, playList);//根据选择删除的歌曲获取该歌曲的目录索引
  playList.splice(fpIndex, 1);// 在播放列表中将删除该项
  // 如果删除的歌曲排在当前播放歌曲前面，那么currentIndex-1，让当前的歌正常播放
  if(fpIndex < currentIndex) currentIndex--;
  //在sequenceList中直接删除歌曲即可
  const fsIndex = findIndex(song, sequenceList);
  sequenceList.splice(fsIndex, 1);
  /*immutable.js的合并方法，
  x.merge(y):将y中的数据更新到x中，已有的覆盖，没有的新增，并最终返回一个新的对象*/
  return state.merge({
    'playList': fromJS(playList),
    'sequencePlayList': fromJS(sequenceList),
    'currentIndex': fromJS(currentIndex),
  });
}
//搜索到的歌曲插入播放器播放列表
const handleInsertSong = (state, song) => {
  const playList = JSON.parse (JSON.stringify (state.get ('playList').toJS ()));
  const sequenceList = JSON.parse (JSON.stringify (state.get ('sequencePlayList').toJS ()));
  let currentIndex = state.get ('currentIndex');
  
  let fpIndex = findIndex (song, playList);//查询要插入的曲目在歌单列表中的索引号
  if (fpIndex === currentIndex && currentIndex !== -1) return state;//如果索引号与当前播放曲目的索引号相同且当前播放曲目的索引号不为-1则退出函数，没必要插入
  if (fpIndex > -1) {// 如果列表中已经存在要添加的歌
    if (currentIndex > fpIndex) {// 如果索引比目前播放歌曲的索引小，那么删除它，同时当前 index 要减一
      playList.splice (fpIndex, 1);
      currentIndex--;
    } else {
      playList.splice (fpIndex, 1);// 否则直接删掉
    }
  }
  //插入歌曲
  currentIndex++;//索引号+1
  /* splice(index,howmany,item1,.....,itemX)
      index：规定添加/删除项目的位置
      howmany：要删除的项目数量。如果设置为 0，则不会删除项目
      item1,.....,itemX：向数组添加的新项目
  */
  playList.splice (currentIndex, 0, song);//向当前的索引号位置插入歌曲
  // 同理，处理 sequenceList
  let sequenceIndex = findIndex (playList[currentIndex], sequenceList) + 1;
  let fsIndex = findIndex (song, sequenceList);
  // 开始插入
  sequenceList.splice (sequenceIndex, 0, song);
  if (fsIndex > -1) {
    // 跟上面类似的逻辑。如果在前面就删掉，index--; 如果在后面就直接删除
    if (sequenceIndex > fsIndex) {
      sequenceList.splice (fsIndex, 1);
      sequenceIndex--;
    } else {
      sequenceList.splice (fsIndex + 1, 1);
    }
  }
  return state.merge ({
    'playList': fromJS (playList),
    'sequencePlayList': fromJS (sequenceList),
    'currentIndex': fromJS (currentIndex),
  });
}

const defaultState = fromJS ({
  fullScreen: false,// 播放器是否为全屏模式
  playing: false, // 当前歌曲是否播放
  sequencePlayList: [], // 顺序列表 (因为之后会有随机模式，列表会乱序，因从拿这个保存顺序列表)
  playList: [],
  mode: playMode.sequence,// 播放模式
  currentIndex: -1,// 当前歌曲在播放列表的索引位置
  showPlayList: false,// 是否展示播放列表
  currentSong: {} 
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_SONG:
      return state.set ('currentSong', action.data);
    case actionTypes.SET_FULL_SCREEN:
      return state.set ('fullScreen', action.data);
    case actionTypes.SET_PLAYING_STATE:
      return state.set ('playing', action.data);
    case actionTypes.SET_SEQUECE_PLAYLIST:
      return state.set ('sequencePlayList', action.data);
    case actionTypes.SET_PLAYLIST:
      return state.set ('playList', action.data);
    case actionTypes.SET_PLAY_MODE:
      return state.set ('mode', action.data);
    case actionTypes.SET_CURRENT_INDEX:
      return state.set ('currentIndex', action.data);
    case actionTypes.SET_SHOW_PLAYLIST:
      return state.set ('showPlayList', action.data);
    case actionTypes.DELETE_SONG:
      return handleDeleteSong(state, action.data);
    case actionTypes.INSERT_SONG:
      return handleInsertSong (state, action.data);
    default:
      return state;
  }
}