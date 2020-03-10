import React, { forwardRef, useState,useEffect, useRef, useImperativeHandle,useMemo } from "react"
import PropTypes from "prop-types"
import BScroll from "better-scroll"
import {ScrollContainer,PullUpLoading,PullDownLoading} from './style'
import Loading from '../loading/index';
import LoadingV2 from '../loading-v2/index';
import { debounce } from "../../api/utils";

/*  better-scroll使用步骤：
    1.创建一个div作为betterscroll的容器
    2.创建一个bscroll对象，配置好bscroll的各项参数，并将该对象绑定到该div容器上
    3.在useeffect中监听bscroll的各种状态，相应的做出相应的操作
*/

//这里的转发ref在recommend中并未用到，因为在调用Scroll组建的时候并未传入ref
//这些在recommend中未曾用到的事件在singer中用到了
const Scroll = forwardRef ((props, ref) => {
  const [bScroll, setBScroll] = useState ();
  //创建一个ref
  const scrollContaninerRef = useRef ();
  //解构获取相关预设的默认配置
  const { direction, click, refresh,  bounceTop, bounceBottom } = props;
  const { pullUp, pullDown,pullUpLoading,pullDownLoading, onScroll } = props;
  //初始化scroll
  useEffect (() => {
    //这里将获取到的DOM节点ScrollContainer传递给BScroll，
    //对该节点进行BScroll的相关初始化配置
    const scroll = new BScroll (scrollContaninerRef.current, {
      scrollX: direction === "horizental",
      scrollY: direction === "vertical",
      /*当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，
      而且在 momentum 滚动动画运行过程中实时派发 scroll 事件*/
      probeType: 3,
      click: click,
      bounce:{
        top: bounceTop,
        bottom: bounceBottom
      }
    });
    //将初始化过的BScroll存储到hooks的函数状态bScroll中
    setBScroll (scroll);
    //return函数在组件销毁的同时清空scroll的配置（useeffect会在组件销毁的时候运行该effect函数返回的函数内容）
    return () => {
      setBScroll (null);
    }
    //eslint-disable-next-line
  }, []);

  let pullUpDebounce = useMemo (() => {
    return debounce (pullUp, 3000)
  }, [pullUp]);
  // 千万注意，这里不能省略依赖，
  // 不然拿到的始终是第一次 pullUp 函数的引用，相应的闭包作用域变量都是第一次的，产生闭包陷阱。下同。
  
  let pullDownDebounce = useMemo (() => {
    return debounce (pullDown, 3000)
  }, [pullDown]);

  //recommend中未使用
  useEffect (() => {
    //如果scroll未初始化或者滑动回调函数为空值则返回空值
    if (!bScroll || !onScroll) return;
    // 设置scroll监听事件，监听事件类型为滚动事件，即‘scroll’，
    // 执行内容为‘onScroll (scroll)’，一旦发生滚动则执行onScroll函数，
    //此处recmmend部分尚未定义使用该函数
    bScroll.on ('scroll', (scroll) => {
      onScroll (scroll);
    })
    return () => {
      bScroll.off ('scroll');
    }
  }, [onScroll, bScroll]);
  //recommend中未使用
  useEffect (() => {
    if (!bScroll || !pullUp) return;
    bScroll.on ('scrollEnd', () => {
      // 判断是否滑动到了底部
      if (bScroll.y <= bScroll.maxScrollY + 100){
        pullUpDebounce ();
      }
    });
    return () => {
      bScroll.off ('scrollEnd');
    }
    //eslint-disable-next-line
  }, [pullUp, bScroll]);  
  //recommend中未使用
  useEffect (() => {
    if (!bScroll || !pullDown) return;
    bScroll.on ('touchEnd', (pos) => {
      // 判断用户的下拉动作
      if (pos.y > 50) {
        pullDownDebounce ();
      }
    });
    return () => {
      bScroll.off ('touchEnd');
    }
    //eslint-disable-next-line
  }, [pullDown, bScroll]);  
  //如果refresh功能开启了且scroll发生了变化则进行bScroll的刷新
  useEffect (() => {
    if (refresh && bScroll){
      bScroll.refresh ();
    }
  });
  //recommend中未使用
  //useImperativeHandle的必要性需要后面考证
  //useImperativeHandle限定了外部对ref定位到的元素的操作方式，只限定在useImperativeHandle提供了的操作方法范围内
  //本质是外部传入的ref只定位到函数组件，通过外部传入函数组件的ref调用useImperativeHandle给出的方法控制函数组件内部元素
  //既然都把组件传给父组件了直接调用他的内部方法不可以吗
  useImperativeHandle (ref, () => ({
    refresh () {
      if (bScroll) {
        bScroll.refresh ();
        bScroll.scrollTo (0, 0);
      }
    },
    getBScroll () {
      if (bScroll) {
        return bScroll;
      }
    }
  }));

  const PullUpdisplayStyle = pullUpLoading ? {display: ""} : { display:"none" };
  const PullDowndisplayStyle = pullDownLoading ? { display: ""} : { display:"none" };

  return (
    // 绑定创建好的ref
    //本质上就是创建一个div，通过绑定好ref，从而在上面的useeffect中实现对这个div的各种控制
    //包括先将div绑定上better-scroll，然后对better-scroll的这种操作监听
    //所以总结概括一下better-scroll的使用步骤
    
    <ScrollContainer ref={scrollContaninerRef}>
    {props.children}
    {/* 滑到底部加载动画 */}
    <PullUpLoading style={ PullUpdisplayStyle }><Loading></Loading></PullUpLoading>
    {/* 顶部下拉刷新动画 */}
    <PullDownLoading style={ PullDowndisplayStyle }><LoadingV2></LoadingV2></PullDownLoading>
  </ScrollContainer>
  );
})

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll:null,
  pullUp: null,
  pullDown: null,
  pullUpLoading: false,
  pullDownLoading: false,
  bounceTop: true,
  bounceBottom: true,
};

Scroll.propTypes = {
  direction: PropTypes.oneOf (['vertical', 'horizental']),// 滚动的方向
  click: PropTypes.bool,// 是否支持点击
  refresh: PropTypes.bool,// 是否刷新
  onScroll: PropTypes.func,// 滑动触发的回调函数
  pullUp: PropTypes.func,// 上拉执行函数
  pullDown: PropTypes.func,// 下拉执行函数
  pullUpLoading: PropTypes.bool,// 是否显示上拉 loading 动画
  pullDownLoading: PropTypes.bool,// 是否显示下拉 loading 动画
  bounceTop: PropTypes.bool,// 上部的回弹动画
  bounceBottom: PropTypes.bool// 下部的回弹动画
};

export default Scroll;
