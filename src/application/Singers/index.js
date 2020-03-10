import React, {useState, useEffect} from 'react';
import Horizen from '../../baseUI/horizen-item';
import { categoryTypes, alphaTypes } from '../../api/config';//实现定义好的分类数组和首字母数组
import { 
  NavContainer,
  ListContainer,
  List,
  ListItem,
} from "./style";
import { 
  getSingerList, 
  getHotSingerList, 
  changeEnterLoading, 
  changePageCount, 
  refreshMoreSingerList, 
  changePullUpLoading, 
  changePullDownLoading, 
  refreshMoreHotSingerList 
} from './store/actionCreators';
import  LazyLoad, {forceCheck} from 'react-lazyload';
import Scroll from './../../baseUI/scroll/index';
import {connect} from 'react-redux';
import Loading from '../../baseUI/loading';
import { renderRoutes } from 'react-router-config';

function Singers(props) {
  let [category, setCategory] = useState('');//当前被点击的分类列表中的项的key值
  let [alpha, setAlpha] = useState('');//当前被点击的首字母列表中的项的key值

  const { singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount,songsCount  } = props;

  const { getHotSingerDispatch, updateDispatch, pullDownRefreshDispatch, pullUpRefreshDispatch } = props;

  useEffect(() => {
    //初始化阶段获取热门歌手
    getHotSingerDispatch();
    // eslint-disable-next-line
  }, []);

  let handleUpdateAlpha = (val) => {
    setAlpha(val);//记录当前点击的首字母的key
    updateDispatch(category, val);
  };

  let handleUpdateCatetory = (val) => {
    setCategory(val);//记录当前点击的分类的key
    updateDispatch(val, alpha);
  };

  const handlePullUp = () => {
    pullUpRefreshDispatch(category, alpha, category === '', pageCount);//下拉到底部时获取更多歌手数据
  };

  const handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha);//上拉到顶部时重新初始化歌手数据
  };

  const enterDetail = (id)  => {
    props.history.push (`/singers/${id}`);
  };

  const renderSingerList = () => {
    const list = singerList ? singerList.toJS(): [];
    console.log(props)
    return (
      /*List和ListItem都是flex的容器 */
      <List>
        {
          list.map((item, index) => {
            return (
              <ListItem key={item.accountId+""+index}  onClick={() => enterDetail (item.id)}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="music"/>}>
                    <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music"/>
                  </LazyLoad>
                </div>
                <span className="name">{item.name}</span>
              </ListItem>
            )
          })
        }
      </List>
    )
  };

  return (
    <div>
      <NavContainer>
        {/*categoryTypes：事先定义好的分类数组，如‘华语男’ alphaTypes：事先定义好的首字母数组，如‘A’ */}
        <Horizen 
          list={categoryTypes} 
          title={"分类(默认热门):"} 
          handleClick={val => handleUpdateCatetory(val)} //这里的val到底是个什么鬼  是哪里来的
          //答：通过子组件Horizen的handleClick方法来向父组件singer组件的handleUpdateCatetory方法传值，这里的val是内置于组件Horizen内部的，他是被点击的子项的key值
          oldVal={category}
        ></Horizen>
        <Horizen 
          list={alphaTypes} 
          title={"首字母:"} 
          handleClick={val => handleUpdateAlpha(val)} 
          oldVal={alpha}
        ></Horizen>
      </NavContainer> 
      <ListContainer play={songsCount}>
        <Scroll
          pullUp={ handlePullUp }//如果监测到滑动到了底部则执行handlePullUp方法
          pullDown = { handlePullDown }//如果监测到滑动到了顶部则执行handlePullDown方法
          pullUpLoading = { pullUpLoading }
          pullDownLoading = { pullDownLoading }
          onScroll={forceCheck}/*用于解除懒加载状态 */
        >
        { renderSingerList() }
        </Scroll>
        <Loading show={enterLoading}></Loading>
      </ListContainer>
      { renderRoutes (props.route.routes) }
    </div>
  )
}

const mapStateToProps = (state) => ({
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount']),
  songsCount: state.getIn (['player', 'playList']).size,
});
const mapDispatchToProps = (dispatch) => {
  return {
    //这里的方法名如果不设定键值则在调用该方法的时候也不用声明‘键值.方法名’了，直接声明方法名即可调用
    getHotSingerDispatch() {
      dispatch(getHotSingerList());
    },
    updateDispatch(category, alpha) {
      dispatch(changePageCount(0));//将当前的页码归零
      dispatch(changeEnterLoading(true));//设置当前处于加载中状态
      dispatch(getSingerList(category, alpha));//根据当前的分类和首字母重新获取要展示的歌手清单
    },
    // 滑到最底部刷新部分的处理
    pullUpRefreshDispatch(category, alpha, hot, count) {
      dispatch(changePullUpLoading(true));//显示loading-v2，同步进行下一页的数据拼接
      dispatch(changePageCount(count+1));//页码+1
      if(hot){
        dispatch(refreshMoreHotSingerList());//如果没有选择分类，则加载更多的热门歌手
      } else {
        dispatch(refreshMoreSingerList(category, alpha));//如果已经选择了分类，则根据当前的分类与首字母加载更多的歌手数据
      }
    },
    //顶部下拉刷新
    pullDownRefreshDispatch(category, alpha) {
      dispatch(changePullDownLoading(true));//设置当前处于加载中状态
      dispatch(changePageCount(0));//清零页码
      if(category === '' && alpha === ''){
        dispatch(getHotSingerList());//如果没设置分类以及首字母咋获取默认的热门歌手清单
      } else {
        dispatch(getSingerList(category, alpha));//如果已经选择过了分类以及首字母则获取对应的歌手清单数据
      }
    }
  }
};   

export default connect(mapStateToProps, mapDispatchToProps)(Singers);