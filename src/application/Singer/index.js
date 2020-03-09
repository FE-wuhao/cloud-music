import React, { useState, useEffect, useRef, useCallback } from "react";
import { CSSTransition } from "react-transition-group";
import { Container } from "./style";
import { HEADER_HEIGHT } from "./../../api/config";
import { ImgWrapper, CollectButton, SongListWrapper, BgLayer } from "./style";
import Header from "../../baseUI/header/index";
import Scroll from "../../baseUI/scroll/index";
import SongsList from "../SongsList/index";
import { connect } from 'react-redux';
import Loading from "./../../baseUI/loading/index";
import { getSingerInfo, changeEnterLoading } from "./store/actionCreators";
import MusicNote from "../../baseUI/music-note/index";

function Singer(props) {
  const initialHeight = useRef(0);//初始高度 我不明白了，这里的ref并没有用到任何元素身上，直接用变量不就好了，这里用什么ref哦。。。。▲
  //2020/3/9 11:18 答：useRef的作用是保存一个不受组件生命周期影响的值。
  //为什么不用usestate？答：当我们更新状态的时候,React 会重新渲染组件,如果用usestate
  //每一次渲染都会拿到独立的state,并重新渲染使用到state的函数. 
  //每一次重新渲染的使用到state的函数里面都有它自己的 count 
  //参考http://www.yanwenbo.cn/topic/5e41427005c6ca503b4aa204
  //https://zhuanlan.zhihu.com/p/102501434
  //https://segmentfault.com/a/1190000020435923?utm_source=tag-newest
  const [showStatus, setShowStatus] = useState(true);//动画的开启与关闭

  const { 
    artist: immutableArtist, //歌手信息
    songs: immutableSongs, //歌曲信息
    loading,//加载的状态
  } = props;
  
  const { getSingerDataDispatch } = props;
  
  const artist = immutableArtist.toJS();//歌手信息
  const songs = immutableSongs.toJS();//歌曲信息

  const collectButton = useRef();//收藏按钮的ref
  const imageWrapper = useRef();//歌手照片的ref
  const songScrollWrapper = useRef();//歌单列表的ref
  const songScroll = useRef();//歌单列表的scroll的ref
  const header = useRef();//返回按键和歌手名那一行的ref
  const layer = useRef();//歌单背面的白色背景的ref
  const musicNoteRef = useRef ();

  //往上偏移的尺寸，露出圆角，否则白色的背景看不到圆角
  const OFFSET = 5;
  const { songsCount } = props;
  //初始化
  useEffect(() => {
    const id = props.match.params.id;//获取路由传参传过来的当前路由的id
    getSingerDataDispatch(id);//获取歌手数据与歌曲数据
    let h = imageWrapper.current.offsetHeight;//content+padding+border的高度
    initialHeight.current = h;//h：歌手照片高度
    songScrollWrapper.current.style.top = `${h - OFFSET}px`;//设置歌单板块的top值为‘歌手照片的高度-5’
    layer.current.style.top = `${h - OFFSET}px`;//歌单列表的背景遮罩top值与歌单同步
    songScroll.current.refresh();
    // eslint-disable-next-line
  }, []);
  //页面滚动监视事件★★★★★★★★★
  const handleScroll = useCallback(pos => {
    let height = initialHeight.current;//歌手照片高度
    const newY = pos.y;//获取的是当前滚动区的y的值
    const imageDOM = imageWrapper.current;//歌手照片的dom
    const buttonDOM = collectButton.current;//收藏按钮的dom
    const headerDOM = header.current;//返回键+标题的dom
    const layerDOM = layer.current;//白色歌单背景遮罩的dom
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;//最小的y值应该是歌单列表的top值-标题的高度值（注:这里是负值）

    //指的是滑动距离占图片高度的百分比
    const percent = Math.abs(newY / height);

    /*这里分了三种情况：
    
    */
    if (newY > 0) {//如果下拉了
      imageDOM.style["transform"] = `scale(${1 + percent})`;//图片放大
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;//收藏按钮下移与下拉同样多的数值
      layerDOM.style.top = `${height - OFFSET + newY}px`;//歌单列表背景遮罩与歌单列表同步移动

    } else if (newY >= minScrollY) {//如果上拉了但是歌单列表的上边框还没够到标题的下边框
      layerDOM.style.top = `${height - OFFSET + newY}px`;//歌单列表背景遮罩与歌单列表同步移动
      //这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住   
      //这一手是什么神操作？？没整明白🔺🔺🔺🔺🔺🔺
      layerDOM.style.zIndex = 1;
      imageDOM.style.paddingTop = "75%";
      imageDOM.style.height = 0;
      imageDOM.style.zIndex = -1;
      //按钮跟着移动且渐渐变透明
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      buttonDOM.style["opacity"] = `${1 - percent * 2}`;

    } else if (newY < minScrollY) {//如果上拉了而且歌单列表的上边框超出了标题的下边框
      //往上滑动，但是超过Header部分
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;//此时白色背景遮罩的高度为固定值45-5=40，即标题高度
      layerDOM.style.zIndex = 1;
      //防止溢出的歌单内容遮住Header
      headerDOM.style.zIndex = 100;
      //此时图片高度与Header一致
      imageDOM.style.height = `${HEADER_HEIGHT}px`;
      imageDOM.style.paddingTop = 0;
      imageDOM.style.zIndex = 99;//这个是必要的 不然字儿就在图片的上方了
    }
  }, [])
  //关闭动画
  const setShowStatusFalse = useCallback(() => {
    setShowStatus(false);
  }, []);

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation ({ x, y });
  };

  return (
    //CSSTransition跟之前一样用来展示过渡动画的
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container play={songsCount}>
        <Header
          handleClick={setShowStatusFalse}
          title={artist.name}//歌手名
          ref={header}
        ></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>{/* 上边的歌手照片 */}
          <div className="filter"></div>{/*整半天 原来这玩意儿用来调色的 */}
        </ImgWrapper>
        <CollectButton ref={collectButton}>{/*收藏按钮 */}
          <i className="iconfont">&#xe62d;</i>
          <span className="text">收藏</span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>{/*歌单列表的白色背景遮罩 */}
        <SongListWrapper ref={songScrollWrapper}>{/*歌单 */}
          <Scroll ref={songScroll} onScroll={handleScroll}>
            <SongsList
              songs={songs}
              showCollect={false}//是否显示收藏数量？  这里是不显示
              musicAnimation={musicAnimation}
            ></SongsList>
          </Scroll>
        </SongListWrapper>
        <Loading show={loading}></Loading>
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  )
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = state => ({
  artist: state.getIn(["singerInfo", "artist"]),
  songs: state.getIn(["singerInfo", "songsOfArtist"]),
  loading: state.getIn(["singerInfo", "loading"]),
  songsCount: state.getIn (['player', 'playList']).size,// 尽量减少 toJS 操作，直接取 size 属性就代表了 list 的长度
});
// 映射dispatch到props上
const mapDispatchToProps = dispatch => {
  return {
    getSingerDataDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getSingerInfo(id));
    }
  };
};

// 将ui组件包装成容器组件
export default connect(mapStateToProps,mapDispatchToProps)(React.memo(Singer));