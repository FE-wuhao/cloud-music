import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  changePlayingState,//当前歌曲是否播放
  changeShowPlayList,//是否展示歌曲清单
  changeCurrentIndex,//当前歌曲在播放列表的索引位置
  changeCurrentSong,//更改当前播放的歌曲
  changePlayList,//更改播放列表
  changePlayMode,//改变播放模式
  changeFullScreen//开启/关闭全屏
} from "./store/actionCreators";
import MiniPlayer from './miniPlayer';
import NormalPlayer from './normalPlayer';
import { getSongUrl, isEmptyObject, shuffle, findIndex } from "../../api/utils";
import Toast from "../../baseUI/toast/index";
import { playMode } from '../../api/config';

/*又发现一个bug  在歌曲上一首下一首切换的时候中间图片的旋转不会初始化▲▲▲▲▲▲ */

function Player (props) {

  const {
    playing,
    currentSong:immutableCurrentSong,
    currentIndex,
    playList:immutablePlayList,
    mode,//播放模式
    sequencePlayList:immutableSequencePlayList,//顺序列表
    fullScreen
  } = props;

  const {
    togglePlayingDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changePlayListDispatch,//改变playList
    changeModeDispatch,//改变mode
    toggleFullScreenDispatch
  } = props;

  const [modeText, setModeText] = useState("");//模式提醒文字内容
  const [preSong, setPreSong] = useState({});//记录当前的歌曲，以便于下次重渲染时比对是否是一首歌 
  const [currentTime, setCurrentTime] = useState(0);//目前播放时间
  const [duration, setDuration] = useState(0);//歌曲总时长

  const toastRef = useRef();
  const audioRef = useRef();

  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();
  const currentSong = immutableCurrentSong.toJS();
    //歌曲播放进度
  /*isNaN() 函数用于检查其参数是否是非数字值。
  如果参数值为 NaN 或字符串、对象、undefined等非数字值则返回 true,
   否则返回 false */
   let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const changeMode = () => {
    let newMode = (mode + 1) % 3;//mode+1进行模式切换： 0：顺序模式 1：单曲循环 2：随机播放
    if (newMode === 0) {//顺序模式
      /*有一个问题：这个sequencePlayList的数据是从哪里来的？？？▲▲▲▲▲▲▲ */
      changePlayListDispatch(sequencePlayList);//重置播放列表的内容为sequencePlayList
      let index = findIndex(currentSong, sequencePlayList);//根据当前的歌曲获取他的索引号
      changeCurrentIndexDispatch(index);//更改当前的索引号
      setModeText("顺序循环");
    } else if (newMode === 1) {//单曲循环
      changePlayListDispatch(sequencePlayList);
      setModeText("单曲循环");
    } else if (newMode === 2) {//随机播放
      let newList = shuffle(sequencePlayList);//洗牌算法打乱sequencePlayList顺序
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
      setModeText("随机播放");
    }
    changeModeDispatch(newMode);//更新当前的mode值
    toastRef.current.show();//显示文字提示
  };

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
  };
  //一首歌循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0;//audio当前播放时间清零
    changePlayingState(true);//设置播放标志位为播放中
    audioRef.current.play();//开始播放
  };

  const handlePrev = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if (index < 0) index = playList.length - 1;//如果索引值小于0则将索引的最大值赋给index
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  const handleNext = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;//如果索引值达到最大值则清零
    if (!playing) togglePlayingDispatch(true);//如果没播放就硬要让他播放！
    changeCurrentIndexDispatch(index);//更改当前的索引值为index
  };

  const updateTime = e => {
    //e.target指向audio元素，currentTime是它的一个属性，表示当前播放的时间，以秒计 
    setCurrentTime(e.target.currentTime);
  };
/*有个bug  在mini播放器暂停曲子以后normal界面的进度调节小圆圈位置会被重置到起点▲▲▲ */
  const onProgressChange = curPercent => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if (!playing) {
      togglePlayingDispatch(true);
    }
  };

  const handleEnd = () => {
    if (mode === playMode.loop) {//如果播放模式是单曲循环模式则执行单曲循环函数
      handleLoop();
    } else {
      handleNext();//否则执行下一曲函数
    }
  };
  //组件初始化
  useEffect(() => {
    if (
      !playList.length ||//播放列表长度为0
      currentIndex === -1 ||//歌曲编号为-1
      !playList[currentIndex] ||//播放列表中该编号歌曲不存在
      playList[currentIndex].id === preSong.id //当前歌曲与上一首歌曲相同
    )
      return;
    let current = playList[currentIndex];//获取当前歌曲
    changeCurrentDispatch(current);//赋值currentSong
    // setSongReady(false);
    setPreSong(current);//记当前曲目
    audioRef.current.src = getSongUrl(current.id);//播放器获取歌曲资源
    /*
        setTimeout（function）的意义
      js是单线程，setTimeout函数虽然时间设置为0，
      但是也是一个异步，他会在任务池中排队等待js引擎空闲才执行
     */
    setTimeout(() => {
      audioRef.current.play();
    });
    togglePlayingDispatch(true);//播放状态
    setCurrentTime(0);//从头开始播放
    setDuration((current.dt / 1000) | 0);//时长
  }, [playList, currentIndex]);

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);

  return (
    <div> 
      { isEmptyObject(currentSong) ? null : 
        <MiniPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          percent={percent}
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
        /> 
      }
      { isEmptyObject(currentSong) ? null : 
        <NormalPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          duration={duration}//总时长
          currentTime={currentTime}//播放时间
          percent={percent}//进度
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          onProgressChange={onProgressChange}
          handlePrev={handlePrev}
          handleNext={handleNext}
          mode={mode}
          changeMode={changeMode}
        />
      }
      <audio 
        ref={audioRef}
        onTimeUpdate={updateTime}//当前播放位置改变时的执行函数
        onEnded={handleEnd}//歌曲播放完处理事件
      ></audio>
      <Toast text={modeText} ref={toastRef}></Toast>
    </div>
  )
}
// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = state => ({
  fullScreen: state.getIn (["player", "fullScreen"]),
  playing: state.getIn (["player", "playing"]),
  currentSong: state.getIn (["player", "currentSong"]),
  showPlayList: state.getIn (["player", "showPlayList"]),
  mode: state.getIn (["player", "mode"]),
  currentIndex: state.getIn (["player", "currentIndex"]),
  playList: state.getIn (["player", "playList"]),
  sequencePlayList: state.getIn (["player", "sequencePlayList"])
});
// 映射 dispatch 到 props 上
const mapDispatchToProps = dispatch => {
  return {
    togglePlayingDispatch (data) {
      dispatch (changePlayingState (data));
    },
    toggleFullScreenDispatch (data) {
      dispatch (changeFullScreen (data));
    },
    togglePlayListDispatch (data) {
      dispatch (changeShowPlayList (data));
    },
    changeCurrentIndexDispatch (index) {
      dispatch (changeCurrentIndex (index));
    },
    changeCurrentDispatch (data) {
      dispatch (changeCurrentSong (data));
    },
    changeModeDispatch (data) {
      dispatch (changePlayMode (data));
    },
    changePlayListDispatch (data) {
      dispatch (changePlayList (data));
    }
  };
};
// 将 ui 组件包装成容器组件
export default connect (mapStateToProps,mapDispatchToProps)(React.memo (Player));