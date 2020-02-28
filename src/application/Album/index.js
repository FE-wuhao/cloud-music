//歌单页面

import React, {useState, useCallback, useRef, useEffect} from 'react';
import {Container,TopDesc,SongList,SongItem,Menu} from './style';
import { CSSTransition } from 'react-transition-group';//第三方动画过度库
import  Header  from './../../baseUI/header/index';
import Scroll from '../../baseUI/scroll/index';
import { getName,getCount,isEmptyObject  } from './../../api/utils';
import style from "../../assets/global-style";
import { connect } from 'react-redux';
import { getAlbumList, changeEnterLoading } from './store/actionCreators';
import Loading from '../../baseUI/loading/index';
import { HEADER_HEIGHT } from './../../api/config';
import MusicNote from "../../baseUI/music-note/index";
import SongsList from '../SongsList';

function Album (props) {
  const id = props.match.params.id;//这里就是路由传参传进来的歌单ID
  const { currentAlbum:currentAlbumImmutable, enterLoading } = props;
  const { getAlbumDataDispatch } = props;
  const [showStatus, setShowStatus] = useState (true);//开启/关闭动画
  const [title, setTitle] = useState ("歌单");//歌单页面最左上角的标题内容
  const [isMarquee, setIsMarquee] = useState (false);// 是否跑马灯

  const headerEl = useRef ();
  const musicNoteRef = useRef ();
  //将请求回来存放到redux中的歌单数据存入currentAlbum变量中
  let currentAlbum = currentAlbumImmutable.toJS ();

  useEffect (() => {
    getAlbumDataDispatch (id);//歌单页面载入的同时获取歌单数据
  }, [getAlbumDataDispatch, id]);

  
  //usecallback的优势是什么？？？
  const handleBack = useCallback (() => {
    setShowStatus (false);//关闭动画
  }, []);
  //该pos参数是一个实例化好的完整的better-scroll对象
  const handleScroll = useCallback ((pos) => {
    let minScrollY = -HEADER_HEIGHT;
    let percent = Math.abs (pos.y/minScrollY);
    let headerDom = headerEl.current;//这是一个Header的ref，获取到的Header节点
    // 滑过顶部的高度开始变化
    if (pos.y < minScrollY) {
      headerDom.style.backgroundColor = style["theme-color"];
      headerDom.style.opacity = Math.min (1, (percent-1)/2);
      setTitle (currentAlbum.name);
      setIsMarquee (true);
    } else {
      headerDom.style.backgroundColor = "";
      headerDom.style.opacity = 1;
      setTitle ("歌单");
      setIsMarquee (false);
    }
  }, [currentAlbum]);
  
  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation ({ x, y });
  };

  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
            <div className="filter"></div>
        </div>
        <div className="img_wrapper">
            <div className="decorate"></div>
            <img src={currentAlbum.coverImgUrl} alt=""/>
            <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">{Math.floor (currentAlbum.subscribedCount/1000)/10} 万 </span>
            </div>
        </div>
        <div className="desc_wrapper">
            <div className="title">{currentAlbum.name}</div>
            <div className="person">
            <div className="avatar">
                <img src={currentAlbum.creator.avatarUrl} alt=""/>
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
            </div>
        </div>
      </TopDesc>
    )
  }
  
  const renderMenu = () => {
    return (
      <Menu>
        <div>
            <i className="iconfont">&#xe6ad;</i>
            评论
        </div>
        <div>
            <i className="iconfont">&#xe86f;</i>
            点赞
        </div>
        <div>
            <i className="iconfont">&#xe62d;</i>
            收藏
        </div>
        <div>
            <i className="iconfont">&#xe606;</i>
            更多
        </div>
    </Menu>
    )
  };
  
  const renderSongList = () => {
    return (
      <SongList>
        <div className="first_line">
            <div className="play_all">
            <i className="iconfont">&#xe6e3;</i>
            <span > 播放全部 <span className="sum">(共 {currentAlbum.tracks.length} 首)</span></span>
            </div>
            <div className="add_list">
            <i className="iconfont">&#xe62d;</i>
            <span > 收藏 ({getCount (currentAlbum.subscribedCount)})</span>
            </div>
        </div>
        <SongItem>
            {
            currentAlbum.tracks.map ((item, index) => {
                return (
                <li key={index}>
                    <span className="index">{index + 1}</span>
                    <div className="info">
                      {/* 
                        item.name：歌名
                        item.ar：歌手们
                        item.al.name：专辑名称
                      */}
                    <span>{item.name}</span>
                    <span>
                        { getName (item.ar) } - { item.al.name }
                    </span>
                    </div>
                </li>
                )
            })
            }
        </SongItem>
    </SongList>
    )
  }

  return (
    <CSSTransition
      in={showStatus}  //根据showStatus的值控制动画的开启与关闭
      timeout={300} //动画执行时长
      classNames="fly" /*作为类名前缀在动画的不同阶段（enter,exits,done）拼接成不同的类名
      如：fly-enter,fly-enter-active,fly-enter-done,fly-exit,fly-exite-active,fly-exit-done, fly-appear
      每一个类名都对应着单独的状态
      */
      appear={true} //渲染的时候就直接执行动画，默认false
      unmountOnExit//为true 代表退出的时候移除dom，也就是该元素dom动画执行完后直接删除该元素节点
      onExited={props.history.goBack}//当组件exit类名被移除时调用props.history.goBack
    >
    {/* 动画展示的旋转平移的具体内容 */}
      <Container>
        <Loading show={enterLoading}></Loading>
        {/*对于这里的header和scroll为什么会有重叠抱有疑问  难道是因为不是一个z-index上的？ */}
        {/*scroll相对于container的大小是100%，故产生了重叠 */}
        <Header ref={headerEl} title={title} handleClick={handleBack} isMarquee={isMarquee}></Header>{/*歌单页面最上方的返回箭头和标题 */}
        
        {/*老规矩  将方法传入scroll组件  在组件内部向方法传参 */}
        {
          !isEmptyObject (currentAlbum) ? (
            <Scroll bounceTop={false} onScroll={handleScroll}>
                <div>{/*这里的div干嘛用的？？？？？ */}
                { renderTopDesc () }
                { renderMenu () }
                {/* { renderSongList () } */}
                <SongsList
                  songs={currentAlbum.tracks}
                  collectCount={currentAlbum.subscribedCount}
                  showCollect={true}
                  showBackground={true}
                  musicAnimation={musicAnimation}
                ></SongsList>
                </div>  
            </Scroll>
        ) : null
      }
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  )
}

// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
  currentAlbum: state.getIn (['album', 'currentAlbum']),
  enterLoading: state.getIn (['album', 'enterLoading']),
});
// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch (id) {
      dispatch (changeEnterLoading (true));
      dispatch (getAlbumList (id));
    },
  }
};

// 将 ui 组件包装成容器组件
export default connect (mapStateToProps, mapDispatchToProps)(React.memo (Album));