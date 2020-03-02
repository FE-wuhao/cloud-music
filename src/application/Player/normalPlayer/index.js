import React, {useRef,useEffect } from "react";
import { getName, formatPlayTime } from "../../../api/utils";
import {
  NormalPlayerContainer,
  Top,
  Middle,
  Bottom,
  Operators,
  CDWrapper,
  ProgressWrapper
} from "./style";
import { CSSTransition } from "react-transition-group";
import { prefixStyle } from "../../../api/utils";
import animations from "create-keyframe-animation";
import ProgressBar from "../../../baseUI/progress-bar";
import { playMode } from './../../../api/config';
import Scroll from "../../../baseUI/scroll";
import { LyricContainer, LyricWrapper } from "./style";

/*又发现一个bug  在播放的时候可以进行歌词与播放器图片之间的切换 但是暂停的时候就不可以了★★★★ */

function NormalPlayer(props) {
  //这里不再使用redux那一套了  而是通过父组件直接传递props到内部使用
  //state
  const {
    fullScreen,//全屏
    song,//当前播放的歌曲
    mode,
    playing,
    percent,
    currentTime,
    duration,
    currentLineNum,//当前播放的歌曲在歌曲清单中的行号
    currentPlayingLyric,//当前播放的歌词
    currentLyric//当前播放的歌词清单
  } = props;
  //dispatch
  const {
    changeMode,
    handlePrev,
    handleNext,
    onProgressChange,
    clickPlaying,
    toggleFullScreen,
    togglePlayList 
  } = props;

  const normalPlayerRef = useRef();//播放器界面全屏容器的ref
  const cdWrapperRef = useRef();//中间圆形图片的ref
  const currentState = useRef ("");
  const lyricScrollRef = useRef ();
  const lyricLineRefs = useRef ([]);

  const transform = prefixStyle("transform");//为属性名称加上‘webkit，moz’等前缀

  const _getPosAndScale = () => {
    const targetWidth = 40;//小圆直径
    const paddingLeft = 40;//小圆圆心x坐标值的绝对值
    const paddingBottom = 30;//小圆圆心y坐标值的绝对值
    const paddingTop = 80;/*大圆上边到视口上端的距离   这里的值我认为算的有问题▲▲▲▲▲▲▲
                            除了算上Middle的top值80px还要算上CDWrapper的top值10%
                          */
    //window.innerWidth  视口宽度（包含滚动条）  
    //$(window).width()不含滚动条
    const width = window.innerWidth * 0.8;//大圆直径 因为css设置的width就是80%  所以这里*0.8
    const scale = targetWidth / width;//小圆与大圆的大小比例  小圆直径/大圆直径
    // 两个圆心的横坐标距离和纵坐标距离（注：负值！）
    const x = -(window.innerWidth / 2 - paddingLeft);
    // const y = window.innerHeight - paddingTop - width / 2 - paddingBottom - cdWrapperRef.current.style.height*0.1;
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom - cdWrapperRef.current.style.height*0.1;
    return {
      x,
      y,
      scale
    };
  };
  const enter = () => {
    normalPlayerRef.current.style.display = "block";
    //获取miniPlayer图片中心相对normalPlayer唱片中心的偏移
    /*
      x:两圆心的X坐标差值
      y:两圆心的y坐标差值
      scale:两圆的大小比例  小/大
    */
    const { x, y, scale } = _getPosAndScale();
    /*
      无论是在动画中还是在react-transition-group中translate都是相对于初始位置做移动。
      也就是说如果你在20%的时候执行translate（50px,0）向右平移了50px
      在30%的时候执行translate（0,0）则会向左平移50px  
      因为你的移动的相对对象永远是初始位置
    */
    let animation = {
      0: {
        //translate3d（x,y,z） x:正右负左  y：正下负上
        //x是负值  所以是向左  y是正值  所以是向下
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`//向左下移动并缩小
      },
      60: {
        transform: `translate3d(0, 0, 0) scale(1.1)`//向右上移动并放大
      },
      100: {
        transform: `translate3d(0, 0, 0) scale(1)`//原地不动并放大
      }
    };
    //这个animations是create-keyframe-animation库的一种用法
    //配置动画相关参数
    animations.registerAnimation({
      name: "move",
      animation,
      presets: {
        duration: 400,
        easing: "linear"//匀速
      }
    });
    //定位元素  播放动画
    animations.runAnimation(cdWrapperRef.current, "move");
  };
  const afterEnter = () => {
    // 进入后解绑帧动画
    const cdWrapperDom = cdWrapperRef.current;
    animations.unregisterAnimation("move");
    cdWrapperDom.style.animation = "";
  };
  const leave = () => {
    if (!cdWrapperRef.current) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = "all 0.4s";
    const { x, y, scale } = _getPosAndScale();
    //之前用的是create-keyframe-animation创建的向右上移动动画
    //这里用的是css自带的transform并配合transition进行的慢动作移动特效
    //那么问题来了 create-keyframe-animation有什么优势呢？？他能做到的事情我css做不到吗▲▲▲▲▲▲▲
    cdWrapperDom.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;//向左下移动并缩小
  };
  const afterLeave = () => {
    if (!cdWrapperRef.current) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = "";
    cdWrapperDom.style[transform] = "";
    //如果退出全屏则隐藏normalPlayer
    normalPlayerRef.current.style.display = "none";
    currentState.current = "";
  };
  const getPlayMode = () => {
    let content;
    if (mode === playMode.sequence) {
      content = "&#xe625;";
    } else if (mode === playMode.loop) {
      content = "&#xe653;";
    } else {
      content = "&#xe61b;";
    }
    return content;
  };
  //用来切换图片界面和歌词界面
  const toggleCurrentState = () => {
    if (currentState.current !== "lyric") {
      currentState.current = "lyric";
    } else {
      currentState.current = "";
    }
  };

  useEffect(() => {
    if (!lyricScrollRef.current) return;
    let bScroll = lyricScrollRef.current.getBScroll();
    if (currentLineNum > 5) {
      // 保持高亮的当前歌词在第5条的位置
      let lineEl = lyricLineRefs.current[currentLineNum - 5].current;
      bScroll.scrollToElement(lineEl, 1000);
    } else {
      // 当前歌词行数<=5, 直接滚动到最顶端
      bScroll.scrollTo(0, 0, 1000);
    }
  }, [currentLineNum]);
  return (
    /*
        用帧动画而不用普通的CSSTransition原因：
        普通的CSSTransition是整个页面作为动画内容
        帧动画是页面中的局部需要动画
        真的是这样吗？？？局部的也可以通过类名控制啊。。。▲▲▲▲▲
    */
    <CSSTransition
      classNames="normal"
      in={fullScreen}//如果全屏则展示载入动画
      timeout={400}
      mountOnEnter
      onEnter={enter}
      onEntered={afterEnter}
      onExit={leave}
      onExited={afterLeave}
    >
      <NormalPlayerContainer ref={normalPlayerRef}>
        {/*背景图片 */}
        <div className="background">
          <img
            src={song.al.picUrl + "?param=300x300"}
            width="100%"
            height="100%"
            alt="歌曲图片"
          />
        </div>
        {/*还是用来调色的 */}
        {/*并列类名可以实现子元素效果？？？这里怎么又来这手操作？？？？ */}
        <div className="background layer"></div>
        {/*标题栏 */}
        <Top className="top">
          {/*返回按钮 */}
          <div className="back"  onClick={() => toggleFullScreen(false)}>
            <i className="iconfont icon-back">&#xe662;</i>
          </div>
          <h1 className="title">{song.name}</h1>{/*歌曲名 */}
          <h1 className="subtitle">{getName(song.ar)}</h1>{/*副标题 歌手名 此处将歌手名数组合并成一行字符串*/}
        </Top>
        {/*中间的歌曲图片 */}
        <Middle ref={cdWrapperRef} onClick={toggleCurrentState}>
          <CSSTransition
            timeout={400}
            classNames="fade"
            in={currentState.current !== "lyric"}//如果currentState.current不是lyric则显示动画
          >
            {/*图片区域 */}
            {/*如果currentState.current不是lyric则显示图片 */}
            <CDWrapper style={{visibility: currentState.current !== "lyric" ? "visible" : "hidden"}}>
              <div className="cd">
                <img
                  className={`image play ${playing ? "" : "pause"}`}//看playing的值 如果是暂停则增加类名pause
                  src={song.al.picUrl + "?param=400x400"}
                  alt=""
                />
              </div>
              <p className="playing_lyric">{currentPlayingLyric}</p>
            </CDWrapper>
          </CSSTransition>
          <CSSTransition
            timeout={400}
            classNames="fade"
            in={currentState.current === "lyric"}//如果currentState.current是lyric则显示动画
          >
            <LyricContainer>
              <Scroll ref={lyricScrollRef}>
                {/* 如果currentState.current是lyric则显示歌词*/}
                <LyricWrapper
                  style={{visibility: currentState.current === "lyric" ? "visible" : "hidden"}}
                  className="lyric_wrapper"
                >
                  {
                    currentLyric
                      ? currentLyric.lines.map ((item, index) => {
                      // 对于每一行歌词都创建ref
                      lyricLineRefs.current [index] = React.createRef ();
                      return (
                        <p
                          className={`text ${
                            currentLineNum === index ? "current" : ""
                          }`}
                          key={item + index}
                          ref={lyricLineRefs.current [index]}
                        >
                          {item.txt}
                        </p>
                      );
                    })
                  : <p className="text pure"> 纯音乐，请欣赏。</p>}
                </LyricWrapper>
              </Scroll>
            </LyricContainer>
          </CSSTransition>
        </Middle>
        {/*底部的播放控制工具栏 */}
        <Bottom className="bottom">
          {/*进度条 */}
          <ProgressWrapper>
            {/*formatPlayTime：将纯粹的秒转化为‘分：秒’的格式 */}
            {/*左边的当前时间 */}
            <span className="time time-l">{formatPlayTime(currentTime)}</span>
            <div className="progress-bar-wrapper">
              {/*中间的进度条 */}
              <ProgressBar
                percent={percent}
                percentChange={onProgressChange}
              ></ProgressBar>
            </div>
            {/*右边的总时间 */}
            <div className="time time-r">{formatPlayTime(duration)}</div>
          </ProgressWrapper>
          {/*播放控制工具栏 */}
          <Operators>
            <div className="icon i-left" onClick={changeMode}>
              <i
                className="iconfont"
                dangerouslySetInnerHTML={{ __html: getPlayMode() }}
              ></i>
            </div>
            <div className="icon i-left" onClick={handlePrev}>
              <i className="iconfont">&#xe6e1;</i>
            </div>
            <div className="icon i-center">
              <i
                className="iconfont"
                onClick={e => clickPlaying(e, !playing)}
                /*react的dangerouslySetInnerHTML在一个dom里直接筛入一段纯html
                格式：dangerouslySetInnerHTML={{ __html: content }}
                */
               //该操作是不安全的，会引发XSS攻击，所以他才叫做‘dangerouslySetInnerHTML’ 是有风险的  能不用则不用
                dangerouslySetInnerHTML={{
                  __html: playing ? "&#xe723;" : "&#xe731;"
                }}
              ></i>
            </div>
            <div className="icon i-right" onClick={handleNext}>
              <i className="iconfont">&#xe718;</i>
            </div>
            <div className="icon i-right" onClick={() => togglePlayList (true)}>
              <i className="iconfont">&#xe640;</i>
            </div>
          </Operators>
        </Bottom>
      </NormalPlayerContainer>
    </CSSTransition>
  );
}

export default React.memo(NormalPlayer);
