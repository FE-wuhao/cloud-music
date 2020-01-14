import React, { forwardRef, useState,useEffect, useRef, useImperativeHandle } from "react"
import PropTypes from "prop-types"
import BScroll from "better-scroll"
import {ScrollContainer} from './style'

//这里的转发ref在recommend中并未用到，因为在调用Scroll组建的时候并未传入ref
const Scroll = forwardRef ((props, ref) => {
  const [bScroll, setBScroll] = useState ();
  //创建一个ref
  const scrollContaninerRef = useRef ();
  //解构获取相关预设的默认配置
  const { direction, click, refresh,  bounceTop, bounceBottom } = props;
  const { pullUp, pullDown, onScroll } = props;
  //初始化scroll
  useEffect (() => {
    //这里将获取到的DOM节点ScrollContainer传递给BScroll，
    //对该节点进行BScroll的相关初始化配置
    const scroll = new BScroll (scrollContaninerRef.current, {
      scrollX: direction === "horizental",
      scrollY: direction === "vertical",
      //当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，
      //而且在 momentum 滚动动画运行过程中实时派发 scroll 事件
      probeType: 3,
      click: click,
      bounce:{
        top: bounceTop,
        bottom: bounceBottom
      }
    });
    //将初始化过的BScroll存储到hooks的函数状态bScroll中
    setBScroll (scroll);
    //return函数在组件销毁的同时清空scroll的配置
    return () => {
      setBScroll (null);
    }
    //eslint-disable-next-line
  }, []);
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
        pullUp ();
      }
    });
    return () => {
      bScroll.off ('scrollEnd');
    }
  }, [pullUp, bScroll]);
  //recommend中未使用
  useEffect (() => {
    if (!bScroll || !pullDown) return;
    bScroll.on ('touchEnd', (pos) => {
      // 判断用户的下拉动作
      if (pos.y > 50) {
        pullDown ();
      }
    });
    return () => {
      bScroll.off ('touchEnd');
    }
  }, [pullDown, bScroll]);
  //如果refresh功能开启了且scroll发生了变化则进行bScroll的刷新
  useEffect (() => {
    if (refresh && bScroll){
      bScroll.refresh ();
    }
  });
  //recommend中未使用
  //useImperativeHandle的必要性需要后面考证
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


  return (
    // 绑定创建好的ref
    <ScrollContainer ref={scrollContaninerRef}>
      {props.children}
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
