import React, { useEffect } from 'react';
import Slider from '../../components/slider';
import RecommendList from '../../components/list';
import Scroll from '../../baseUI/scroll/index';
import { Content } from './style';
import { connect } from "react-redux";
import * as actionTypes from './store/actionCreators';
import { forceCheck } from 'react-lazyload';
import Loading from '../../baseUI/loading/index';

function Recommend (props) {
  //bannerList:轮播图的图片资源
  //recommendList：列表图片，文字资源
  const { bannerList, recommendList,enterLoading } = props;

  const { getBannerDataDispatch, getRecommendListDataDispatch } = props;

  useEffect (() => {
   // 如果页面有数据，则不发请求
  //immutable 数据结构中长度属性 size
  if (!bannerList.size){
    getBannerDataDispatch ();
  }
  if (!recommendList.size){
    getRecommendListDataDispatch ();
  }
  }, []);//useeffect第二个参数传入空数组可以保证effect只在mount阶段运行，避免组件更新后带来的重新渲染，如果能确切定位到具体需要订阅的对象自然是最好了
  //经过测试，页面切换确实会进入这个effect，难道页面切换会导致组件unmount？？？？需要核实
  //已核实，路由跳转确实会导致组件销毁2020.2.16 14:15
  const bannerListJS = bannerList ? bannerList.toJS () : [];
  const recommendListJS = recommendList ? recommendList.toJS () :[];

  return (
    <Content>
      {/* 这个loading是fix布局的，相对于视口窗全屏，所以放在哪里都可以 */}
      <Loading show={enterLoading}></Loading>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
    </Content> 
  )
}

// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
  // 不要在这里将数据 toJS
  // 不然每次 diff 比对 props 的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用 immutable，在最后一步真正要使用到store中的数据的时候再转成tojs的
  //这里是immutable的多层级查询
  //immutableData.get('a') // {a:1} 得到1。
  //immutableData.getIn(['a', 'b']) // {a:{b:2}} 得到2。访问深层次的key

  bannerList: state.getIn (['recommend', 'bannerList']),
  recommendList: state.getIn (['recommend', 'recommendList']),
  enterLoading: state.getIn (['recommend', 'enterLoading'])
});
// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
  return {
    //getBannerDataDispatch只是自己取的方法名
    getBannerDataDispatch () {
      dispatch (actionTypes.getBannerList ());
    },
    getRecommendListDataDispatch () {
      dispatch (actionTypes.getRecommendList ());
    },
  }
};

// 将 ui 组件包装成容器组件
export default connect (mapStateToProps, mapDispatchToProps)(React.memo (Recommend));//这种形式多半是个闭包，前一个括号是原方法的参数，后一个括号是return的方法的参数
// export default React.memo(Recommend);