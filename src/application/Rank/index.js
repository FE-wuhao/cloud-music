import React,{useEffect} from 'react';
import { connect } from 'react-redux';
import {getRankList} from './store/actionCreators'
import {List,ListItem,SongList,Container,EnterLoading} from './style'
import Scroll from '../../baseUI/scroll/index';
import { filterIndex } from '../../api/utils';
import { renderRoutes } from 'react-router-config';
import Loading from '../../baseUI/loading';

function Rank(props) {
  //rankList:list用于改名，接口提供的键名是rankList，改成list   我不理解的是这里为什么要改名？有必要嘛？？？？？？？
  const { rankList:list, loading,songsCount } = props;

  const { getRankListDataDispatch } = props;

  let rankList = list ? list.toJS () : [];
  //组件挂载的同时获取排行榜信息
  useEffect (() => {
    if(!rankList.length){
      getRankListDataDispatch();
    }
  }, []);

  const enterDetail = (detail) => {
    props.history.push(`/rank/${detail.id}`)
  }
  //找出全球榜与官方榜的分界点索引值，并将全球榜和官方榜的数据分离开来分别存储
  let globalStartIndex = filterIndex(rankList);
  let officialList = rankList.slice(0, globalStartIndex);
  let globalList = rankList.slice(globalStartIndex);

  //renderSongList是renderRankList的子项，用于渲染官方榜右边的歌曲信息的
  const renderSongList = (list) => {
    return list.length ? (//这里的list.length是tracks的长度  也就是如果歌曲信息有就渲染 没有就不渲染
      <SongList>
        {
          list.map ((item, index) => {
            return <li key={index}>{index+1}. {item.first} - {item.second}</li>//这儿是歌曲信息展示的一种格式：‘索引+1.歌名-歌手’
          })
        }
      </SongList>
    ) : null;
  }

  // 这是渲染榜单列表函数，传入 global 变量来区分不同的布局方式
  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>{/*这里看有没有传入global  如果global为空值则不进行flex布局渲染‘官方榜’ 如果global为空则进行flex布局渲染‘全球榜’ */}
        {
        list.map ((item) => {
          return (
            /*就是这个key有问题 */
            <ListItem key={item.coverImgId} tracks={item.tracks} onClick={() => enterDetail (item)}>{/*根据是否有tracks来决定是否进行flex布局以及榜单图片的大小设置 */}
              <div className="img_wrapper">
                <img src={item.coverImgUrl} alt=""/>{/*榜单图片 */}
                <div className="decorate"></div>{/*遮罩来防止图片颜色太浅看不清字（但是该看不清的还是看不清。。。。。） */}
                <span className="update_frequecy">{item.updateFrequency}</span>{/*图片下方位置对应的更新时间文字 */}
              </div>
              { renderSongList (item.tracks)  }
            </ListItem>
          )
        })
      } 
      </List>
    )
  }

  // 榜单数据未加载出来之前都给隐藏
  let displayStyle = loading ? {"display":"none"}:  {"display": ""};

  return (
    <Container play={songsCount}>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}> 官方榜 </h1>
            { renderRankList (officialList) }
          <h1 className="global" style={displayStyle}> 全球榜 </h1>
            { renderRankList (globalList, true) }
          { loading ? <EnterLoading><Loading></Loading></EnterLoading> : null }{/*所以这里的EnterLoading到底是干嘛的？？？？？？？？？？？？？？？？？？有啥用？？？？？？？？ */}
        </div>
      </Scroll> 
      {renderRoutes (props.route.routes)}
    </Container>
    );
}

// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
  rankList: state.getIn (['rank', 'rankList']),
  loading: state.getIn (['rank', 'loading']),
  songsCount: state.getIn (['player', 'playList']).size,
});
// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
  return {
    getRankListDataDispatch () {
      dispatch (getRankList ());
    }
  }
};

export default connect (mapStateToProps, mapDispatchToProps)(React.memo (Rank));