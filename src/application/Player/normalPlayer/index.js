import React, {useRef} from "react";
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
  } = props;
  //dispatch
  const {
    changeMode,
    handlePrev,
    handleNext,
    onProgressChange,
    clickPlaying,
    toggleFullScreen
  } = props;

  const normalPlayerRef = useRef();//播放器界面全屏容器的ref
  const cdWrapperRef = useRef();//中间圆形图片的ref

  const transform = prefixStyle("transform");

  const _getPosAndScale = () => {
    const targetWidth = 40;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 80;
    const width = window.innerWidth * 0.8;
    const scale = targetWidth / width;
    // 两个圆心的横坐标距离和纵坐标距离
    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    return {
      x,
      y,
      scale
    };
  };
  const enter = () => {
    normalPlayerRef.current.style.display = "block";
    const { x, y, scale } = _getPosAndScale();//获取miniPlayer图片中心相对normalPlayer唱片中心的偏移
    let animation = {
      0: {
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
      },
      60: {
        transform: `translate3d(0, 0, 0) scale(1.1)`
      },
      100: {
        transform: `translate3d(0, 0, 0) scale(1)`
      }
    };
    animations.registerAnimation({
      name: "move",
      animation,
      presets: {
        duration: 400,
        easing: "linear"
      }
    });
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
    cdWrapperDom.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };
  const afterLeave = () => {
    if (!cdWrapperRef.current) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = "";
    cdWrapperDom.style[transform] = "";
    //如果退出全屏则隐藏normalPlayer
    normalPlayerRef.current.style.display = "none";
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

  return (
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
        <Middle ref={cdWrapperRef}>
          <CDWrapper>{/*图片区域 */}
            <div className="cd">
            <img
              className={`image play ${playing ? "" : "pause"}`}//看playing的值 如果是暂停则增加类名pause
              src={song.al.picUrl + "?param=400x400"}
              alt=""
            />
            </div>
          </CDWrapper>
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
                dangerouslySetInnerHTML={{
                  __html: playing ? "&#xe723;" : "&#xe731;"
                }}
              ></i>
            </div>
            <div className="icon i-right" onClick={handleNext}>
              <i className="iconfont">&#xe718;</i>
            </div>
            <div className="icon i-right">
              <i className="iconfont">&#xe640;</i>
            </div>
          </Operators>
        </Bottom>
      </NormalPlayerContainer>
    </CSSTransition>
  );
}

export default React.memo(NormalPlayer);
