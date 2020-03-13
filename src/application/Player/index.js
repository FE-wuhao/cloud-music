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
import PlayList from './play-list/index';
import {getLyricRequest} from '../../api/request'
import Lyric from './../../api/lyric-parser';
 
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
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changePlayListDispatch,//改变playList
    changeModeDispatch,//改变mode
    togglePlayingDispatch,
    toggleFullScreenDispatch,
    togglePlayListDispatch
  } = props;

  const [modeText, setModeText] = useState("");//模式提醒文字内容
  const [preSong, setPreSong] = useState({});//记录当前的歌曲，以便于下次重渲染时比对是否是一首歌 
  const [currentTime, setCurrentTime] = useState(0);//目前播放时间
  const [duration, setDuration] = useState(0);//歌曲总时长
  const [currentPlayingLyric, setPlayingLyric] = useState ("");//当前播放点处歌词

  const toastRef = useRef();
  const audioRef = useRef();
  const songReady = useRef (true);
  const currentLyric = useRef ();//指向实例化的歌词解析对象，该对象的类就是lyric-parser中编写的类Lyric
                                 //其实就是当前播放的歌曲的歌词解析后生成的对象
  const currentLineNum = useRef (0);//当前歌词播放行数

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
      /*答：来自子组件songlist，点击歌曲触发的事件更新了playList和sequencePlayList 2020/3/12 9:45*/
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
    if (currentLyric.current) {
      currentLyric.current.togglePlay (currentTime*1000);//秒转毫秒，当前播放时间currentTime作为offset传入播放/暂停函数togglePlay
    }
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
    if (currentLyric.current) {
      currentLyric.current.seek (newTime * 1000);
    }
  };
  const handleEnd = () => {
    if (mode === playMode.loop) {//如果播放模式是单曲循环模式则执行单曲循环函数
      handleLoop();
    } else {
      handleNext();//否则执行下一曲函数
    }
  };
  const handleError = () => {
    songReady.current = true;
    alert ("播放出错");
  };
  //该回调的任务是获得当前正在播放的歌词以及歌词所在的行数，
  //并存放进 ref：linenum 和 usestate：currentPlayingLyric 中
  //一旦调用currentLyric.current的play方法或者seek方法就会触发回调，更新当前播放器歌词的信息
  const handleLyric = ({lineNum, txt}) => {
    if (!currentLyric.current) return;//如果当前的歌词清单对象不存在退出当前函数handleLyric
    currentLineNum.current = lineNum;//设置当前播放的歌词在歌词数组中的行数lineNum
    setPlayingLyric (txt);//设置当前播放的歌词内容是txt
  };
  //获取当前播放的歌曲的歌词
  const getLyric = id => {
    let lyric = "";
    if (currentLyric.current) {//如果当前歌词信息为空
      currentLyric.current.stop ();//设置播放状态为暂停且停止timer以终止歌词的播放
    }
    // 避免 songReady 恒为 false 的情况
    getLyricRequest (id)//根据歌曲id请求歌词
      .then (data => {
        lyric = data.lrc.lyric;//异步之后取得歌词
        if (!lyric) {
          currentLyric.current = null;
          return;
        }
        currentLyric.current = new Lyric (lyric, handleLyric);//实例化Lyric对象用以解析排版歌词
                                                              //这里的回调的任务是获得当前正在播放的歌词以及歌词所在的行数，
                                                              //并存放进ref和usestate中
        currentLyric.current.play ();//照理说要给play传递当前歌曲播放的相关进度信息的，但这里是刚获得歌词信息的地方，
                                     //songready标志位尚未置位，歌曲尚未播放，故直接使用默认值0就行了
        currentLineNum.current = 0;//这里的ref值也给0就可以了
        currentLyric.current.seek (0);//既然这里都seek了，那上面的play的意义何在呢？反正seek也要执行play，唯一的区别是传入的isSeek的值不一样，想不太通▲▲
      })
      .catch (() => {
        //歌词出问题了也正常播放歌曲
        songReady.current = true;
        audioRef.current.play ();
      });
  };
  //组件初始化
  useEffect(() => {
    if (
      !playList.length ||//播放列表长度为0
      currentIndex === -1 ||//歌曲编号为-1
      !playList[currentIndex] ||//播放列表中该编号歌曲不存在
      playList[currentIndex].id === preSong.id || //当前歌曲与上一首歌曲相同  对标的是播放列表发生了变化但是当前播放曲目的位置并未改变的情况
      !songReady.current
    )
      return;
    let current = playList[currentIndex];//获取当前歌曲
    changeCurrentDispatch(current);//赋值currentSong
    songReady.current = false;/* songReady的初始值是true，这里把songReady置为false,
                                 这样在这首歌成功播放之前songReady都是false，也就是说一进useeffect都会
                                 return，直到play执行完了置songReady为true才能播放下一首歌 */
                                 /*那么问题来了  既然return了 那么那一次的点击操作应该是被忽略了，
                                 也就是相当于没点，那为什么还会在值变为true以后执行了歌曲的切换呢？？？▲▲▲▲▲
                                 */
    setPreSong(current);//记当前曲目
    audioRef.current.src = getSongUrl(current.id);//播放器获取歌曲资源
    /*
        setTimeout（function）的意义
      js是单线程，setTimeout函数虽然时间设置为0，
      但是也是一个异步，他会在任务池中排队等待js引擎空闲才执行
     */
    setTimeout(() => {
      // 注意，play 方法返回的是一个 promise 对象
      audioRef.current.play ().then (() => {
        songReady.current = true;
      });
    });
    togglePlayingDispatch(true);//播放状态
    getLyric (current.id);//根据歌曲id获取歌词信息
    setCurrentTime(0);//从头开始播放
    setDuration((current.dt / 1000) | 0);//时长  回头测试一下|和||是否都能达到动态选择对象的效果▲▲▲▲▲
    //eslint-disable-next-line
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
          togglePlayList={togglePlayListDispatch}//是否显示比方列表
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
          togglePlayList={togglePlayListDispatch}
          currentLyric={currentLyric.current}
          currentPlayingLyric={currentPlayingLyric}
          currentLineNum={currentLineNum.current}
        />
      }
      <audio 
        ref={audioRef}
        onTimeUpdate={updateTime}//当前播放位置改变时的执行函数
        onEnded={handleEnd}//歌曲播放完处理事件
        onError={handleError}
      ></audio>
      <PlayList></PlayList>
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