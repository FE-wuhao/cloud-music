import { connect } from "react-redux";
import { PlayListWrapper, ScrollWrapper, ListHeader, ListContent } from './style';
import { CSSTransition } from 'react-transition-group';
import React, { useRef, useState, useCallback } from 'react';
import { prefixStyle, getName, shuffle, findIndex } from './../../../api/utils';
import { changeShowPlayList, changeCurrentIndex, changePlayMode, changePlayList, deleteSong,changeSequecePlayList, changeCurrentSong, changePlayingState } from "../store/actionCreators";
import { playMode } from "../../../api/config";
import Scroll from '../../../baseUI/scroll';
import Confirm from './../../../baseUI/confirm/index';

//组件内代码
function PlayList(props) {
  const [canTouch,setCanTouch] = useState(true);// 是否允许滑动事件生效
  const [startY, setStartY] = useState(0);// touchStart后记录y值
  const [initialed, setInitialed] = useState(0);// touchStart事件是否已经被触发
  const [distance, setDistance] = useState(0);// 用户下滑的距离
  const [isShow, setIsShow] = useState(false);//是否弹出的歌曲清单

  const listContentRef = useRef();//歌单列表的ref
  const confirmRef = useRef();//警告框的ref
  const playListRef = useRef();//包含标题栏的歌单列表的ref
  const listWrapperRef = useRef();//上面大哥的子元素 不过也是包含标题栏的歌单列表的ref

  const {
    currentIndex,
    currentSong:immutableCurrentSong,
    showPlayList,
    playList:immutablePlayList,
    mode,
    sequencePlayList:immutableSequencePlayList
  } = props;

  const {
    togglePlayListDispatch,//展示\不展示播放列表
    changeCurrentIndexDispatch,
    changePlayListDispatch,
    changeModeDispatch,
    deleteSongDispatch,
    clearDispatch 
  } = props;
  
  const currentSong = immutableCurrentSong.toJS();
  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();

  const transform = prefixStyle("transform");
  //为什么CSSTradition的动画要在这写  在css样式中写不行吗？后面回头验证一下▲▲▲
  const onEnterCB = useCallback(() => {
    //让列表显示
    setIsShow(true);
    //最开始是隐藏在下面
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform]);
  
  const onEnteringCB = useCallback(() => {
    //让列表展现
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
  }, [transform]);
  
  const onExitingCB = useCallback(() => {
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`;
  }, [transform]);
  
  const onExitedCB = useCallback(() => {
    setIsShow(false);
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`;
  }, [transform]);
  //判断是不是当前正在播放的歌曲，如果是则返回一个icon
  const getCurrentIcon = (item) => {
    const current = currentSong.id === item.id;
    const className = current ? 'icon-play' : '';
    const content = current ? '&#xe6e3;': '';
    return (
      <i className={`current iconfont ${className}`} 
      dangerouslySetInnerHTML={{__html:content}}></i>
    )
  };
  
  const getPlayMode = () => {
    let content, text;
    if(mode === playMode.sequence) {
      content = "&#xe625;";
      text = "顺序播放";
    } else if(mode === playMode.loop) {
      content = "&#xe653;";
      text = "单曲循环";
    } else {
      content = "&#xe61b;";
      text = "随机播放";
    }
    return (
      <div>
        <i  className="iconfont" 
            onClick={(e) => changeMode(e)}  
            dangerouslySetInnerHTML={{__html: content}}></i>
        <span className="text" onClick={(e) => changeMode(e)}>{text}</span>
      </div>
    )
  };

  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      //顺序模式
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
    } else if (newMode === 1) {
      //单曲循环
      changePlayListDispatch(sequencePlayList);
    } else if (newMode === 2) {
      //随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
    }
    changeModeDispatch(newMode);
  };

  const handleChangeCurrentIndex = (index) => {
    if(currentIndex === index) return;
    changeCurrentIndexDispatch(index);
  };

  const handleDeleteSong = (e, song) => {
    e.stopPropagation();
    deleteSongDispatch(song);
  };

  const handleShowClear = () => {
    confirmRef.current.show();//组件内置方法  控制组件CssTraditon的开启与关闭
  };

  const handleConfirmClear = () => {
    clearDispatch();
  };

  const handleScroll = (pos) => {
    //只有当内容偏移量为0的时候才能下滑关闭PlayList。否则一边内容在移动，一边列表在移动，出现bug
    let state = pos.y === 0;
    setCanTouch(state);
  };
  /*touch类事件：控制弹出歌单列表的上下拉 */
  const handleTouchStart = (e) => {
    //如果没有歌单列表的物理偏移或者touchStart事件没有触发，则往下执行，否则退出函数
    if(!canTouch || initialed) return;
    listWrapperRef.current.style["transition"] = "";
    setStartY(e.nativeEvent.touches[0].pageY);//记录y值
    setInitialed(true);
  };

  const handleTouchMove = (e) => {
    //如果没有歌单列表的物理偏移或者touchStart事件已经被触发，则往下执行
    if(!canTouch || !initialed) return;
    let distance = e.nativeEvent.touches[0].pageY - startY;//用现在的Y值-初始值得到滑动距离
    if(distance < 0) return;//如果是上滑则退出函数
    setDistance(distance);//否则记录下滑距离
    //并同步向下平移歌曲清单
    listWrapperRef.current.style.transform = `translate3d(0, ${distance}px, 0)`;
  };

  const handleTouchEnd = (e) => {
    setInitialed(false);//设置开始滑动为false
    //这里设置阈值为150px
    if(distance >= 150) {
      //大于150px则关闭PlayList
      togglePlayListDispatch(false);
    } else {
      //否则反弹回去
      listWrapperRef.current.style["transition"] = "all 0.3s";
      //问题来了  这里为什么是平移0  难道说只要平移的过程没有中断那么平邑的相对对象总是初始位置？？？▲▲▲
      listWrapperRef.current.style[transform] = `translate3d(0px, 0px, 0px)`;
    }
  };

  return (
    /*CSSTransition不仅自动生成classNames-xx系列类名，
      还可以在onEnter，onEntering，onExiting，onExited各个阶段执行自定义事件  */
    <CSSTransition 
      in={showPlayList} 
      timeout={300} 
      classNames="list-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCB}
    >
      <PlayListWrapper 
        ref={playListRef} 
        style={isShow === true ? { display: "block" } : { display: "none" }} 
        onClick={() => togglePlayListDispatch(false)}//点击空白处时关闭歌单
      >
        {/*这里的touch事件是相对于整个弹出的整个播放列表的touch */}
        <div 
          className="list_wrapper" 
          ref={listWrapperRef} 
          onClick={e => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/*标题栏：显示‘播放模式’和‘清空列表’ */}
          <ListHeader>
            <h1 className="title">
              { getPlayMode() }
              <span className="iconfont clear" onClick={handleShowClear}>&#xe63d;</span>
            </h1>
          </ListHeader>
          {/*歌单列表 */}
          <ScrollWrapper>
            <Scroll 
              ref={listContentRef} 
              onScroll={pos => handleScroll(pos)}
              bounceTop={false}
            >
                <ListContent>
                  {
                    playList.map((item, index) => {
                      return (
                        <li className="item" key={item.id} onClick={() => handleChangeCurrentIndex(index)}>
                          { getCurrentIcon(item) }{/*判断是不是当前正在播放的歌曲，如果是则返回一个icon */}
                          <span className="text">{item.name} - {getName(item.ar)}</span>
                          <span className="like">
                            <i className="iconfont">&#xe601;</i>
                          </span>
                          {/*删除歌单中的某个曲目 */}
                          <span className="delete" onClick={(e) => handleDeleteSong(e, item)}>
                            <i className="iconfont">&#xe63d;</i>
                          </span>
                        </li>
                      )
                    })
                  }
                </ListContent>
              </Scroll>
          </ScrollWrapper>
          {/*对于清空列表的消息确认框 */}
          <Confirm 
            ref={confirmRef}
            text={"是否删除全部?"} 
            cancelBtnText={"取消"} 
            confirmBtnText={"确定"} 
            handleConfirm={handleConfirmClear}
          />
        </div>
      </PlayListWrapper>
    </CSSTransition>
  )
}
// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  currentIndex: state.getIn(['player', 'currentIndex']),
  currentSong: state.getIn(['player', 'currentSong']),
  playList: state.getIn(['player', 'playList']),//播放列表
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),//顺序排列时的播放列表
  showPlayList: state.getIn(['player', 'showPlayList']),
  mode: state.getIn(['player', 'mode'])
});
// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    //修改当前歌曲在列表中的index，也就是切歌
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data));
    },
    //修改当前的播放模式
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
    //修改当前的歌曲列表
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    },
    deleteSongDispatch(data) {
      dispatch(deleteSong(data));
    },
    clearDispatch() {
      // 1.清空两个列表
      dispatch(changePlayList([]));
      dispatch(changeSequecePlayList([]));
      // 2.初始currentIndex
      dispatch(changeCurrentIndex(-1));
      // 3.关闭PlayList的显示
      dispatch(changeShowPlayList(false));
      // 4.将当前歌曲置空
      dispatch(changeCurrentSong({}));
      // 5.重置播放状态
      dispatch(changePlayingState(false));
    }
  }
};
// 将ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PlayList));