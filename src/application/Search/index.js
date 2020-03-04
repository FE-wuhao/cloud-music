import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import SearchBox from './../../baseUI/search-box/index';
import { getHotKeyWords, changeEnterLoading, getSuggestList } from './store/actionCreators';
import { connect } from 'react-redux';
import { getSongDetail } from './../Player/store/actionCreators';
import { Container, ShortcutWrapper, HotKey } from './style';
import Scroll from '../../baseUI/scroll';
import Loading from './../../baseUI/loading/index';
import LazyLoad, {forceCheck} from 'react-lazyload';
import { List, ListItem, SongItem } from './style';
import { getName } from '../../api/utils';
import MusicalNote from '../../baseUI/music-note';
//这边搜索模块整个的都存在一个问题  当路由跳转以后再返回的时候曾经输入的搜索内容已经被销毁了  需要优化▲▲
//还有一个bug  会陷入死循环。。。。▲▲
//music.png 和 singer.png 是懒加载在图片为加载出来时作为相关歌手和相关歌单的备用图片
function Search(props) {
  const [show, setShow] = useState(false);//动画的开关
  const [query, setQuery] = useState('');
  const musicNoteRef = useRef();

  const {
    hotList, 
    enterLoading, 
    suggestList: immutableSuggestList, 
    songsCount, 
    songsList: immutableSongsList
  } = props;
  const {
    getHotKeyWordsDispatch,
    changeEnterLoadingDispatch,
    getSuggestListDispatch,
    getSongDetailDispatch
  } = props;

  const suggestList = immutableSuggestList.toJS();
  const songsList = immutableSongsList.toJS();

  const searchBack = useCallback(() => {
    setShow(false);
  }, []);
  //传入M层的回调函数，用以将V层的变化传递到M层
  const handleQuery = (q) => {
    setQuery(q);
    if(!q) return;
    changeEnterLoadingDispatch(true);
    getSuggestListDispatch(q);
  };
  //在没有输入任何搜索内容的时候渲染热门推荐界面
  const renderHotKey = () => {
    let list = hotList ? hotList.toJS(): [];
    return (
      <ul>
        {
          //item.first：推荐内容的文字，如“朋友请听好”
          //onclick触发回调，使得V层的Query传递到M层实现双向绑定
          list.map(item => {
            return (
              <li className="item" key={item.first} onClick={() => setQuery(item.first)}>
                <span>{item.first}</span>
              </li>
            )
          })
        }
      </ul>
    )
  };
  //简简单单的样式渲染和路由跳转  没有什么东西
  const renderAlbum = () => {
    let albums = suggestList.playlists;
    if(!albums || !albums.length) return;
    return (
      <List>
        <h1 className="title">相关歌单</h1>
        {
          albums.map((item, index) => {
            return (
              //这里的路由为什么要到根路由上去创建一个album  作为search路由的子路由不行吗？？？▲▲▲
              <ListItem key={item.accountId+""+index} onClick={() => props.history.push(`/album/${item.id}`)}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./music.png')} alt="music"/>}>
                    <img src={item.coverImgUrl} width="100%" height="100%" alt="music"/>
                  </LazyLoad>
                </div>
                <span className="name">歌单: {item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };
  //同样是简简单单的样式渲染和路由跳转  没有什么东西
  const renderSingers = () => {
    let singers = suggestList.artists;
    if(!singers || !singers.length) return;
    return (
      <List>
        <h1 className="title">相关歌手</h1>
        {
          singers.map((item, index) => {
            return (
              <ListItem key={item.accountId+""+index} onClick={() => props.history.push(`/singers/${item.id}`)}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="singer"/>}>
                    <img src={item.picUrl} width="100%" height="100%" alt="music"/>
                  </LazyLoad>
                </div>
                <span className="name">歌手: {item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };
  const renderSongs = () => {
    return (
      <SongItem style={{paddingLeft: "20px"}} > 
        {
          songsList.map(item => {
            return (
              //selectItem根据歌曲id获取歌曲相关资源信息，并插入到播放器的播放列表中去
              <li key={item.id} onClick={(e) => selectItem(e, item.id)}>
                <div className="info">
                  <span>{item.name}</span>
                  <span>
                    { getName(item.artists) } - { item.album.name }
                  </span>
                </div>
              </li>
            )
          })
        }
      </SongItem>
    )
  };
  const selectItem = (e, id) => {
    getSongDetailDispatch(id);
    console.log(e);
    musicNoteRef.current.startAnimation({x:e.nativeEvent.clientX, y:e.nativeEvent.clientY});
  }

  useEffect(() => {
    setShow(true);
    //用了redux缓存，不再赘述
    console.log(hotList)
    if(!hotList.size)
      getHotKeyWordsDispatch();
    // eslint-disable-next-line
  }, []);

  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
    <Container play={songsCount}>{/*从redux中获取歌单信息，如果有歌就要调整bottom高度了 */}
      <div className="search_box_wrapper">
        <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery}></SearchBox>
      </div>
      <ShortcutWrapper show={!query}>{/*未输入搜索内容，展示热门推荐 */}
        <Scroll>
          <div>
            <HotKey>
              <h1 className="title">热门搜索</h1>
              {renderHotKey()}
            </HotKey>
          </div>
        </Scroll>
      </ShortcutWrapper>
      <ShortcutWrapper show={query}>{/*输入搜索内容后展示的相关歌手、歌单、歌曲信息 */}
        <Scroll onScorll={forceCheck}>
          <div>
            { renderSingers() }
            { renderAlbum() }
            { renderSongs() }
          </div>
        </Scroll>
      </ShortcutWrapper>
      <Loading show={enterLoading}></Loading>
      <MusicalNote ref={musicNoteRef}></MusicalNote>
    </Container>
  </CSSTransition>
  )
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  hotList: state.getIn(['search', 'hotList']),
  enterLoading: state.getIn(['search', 'enterLoading']),
  suggestList: state.getIn(['search', 'suggestList']),
  songsCount: state.getIn(['player', 'playList']).size,
  songsList: state.getIn(['search', 'songsList'])
});
// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getHotKeyWordsDispatch() {
      dispatch(getHotKeyWords());
    },
    changeEnterLoadingDispatch(data) {
      dispatch(changeEnterLoading(data))
    },
    getSuggestListDispatch(data) {
      dispatch(getSuggestList(data));
    },
    getSongDetailDispatch(id) {
      dispatch(getSongDetail(id));
    }
  }
};
// 将ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Search));