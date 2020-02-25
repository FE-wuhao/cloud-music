import React from 'react';
import { renderRoutes } from "react-router-config";
import { 
  Top,
  Tab,
  TabItem, } from './style';
import { NavLink } from 'react-router-dom';
import Player from '../Player';

/*
  嵌套路由需要在产生嵌套的父组件内再次声明renderRoutes
  重点： 每个组件的props默认都携带了route对象，
        且route对象的内容与routes配置文件中的内容保持一致。
*/
function Home (props) {
  const  {route}  = props;//对象的解构，自动匹配键名获取相应的值

  return (
    <div>
      { renderRoutes (route.routes) }
      <Top>
        {/* unicode模式引入iconfont，有字体编码的同时还有其对应的classname，便于直观了解是什么图标 */}
        <span className="iconfont menu">&#xe65c;</span>
        <span className="title">WebApp</span>
        <span className="iconfont search">&#xe62b;</span>
      </Top>
      <Tab>
        {/* 
          1.activeClassName所携带的样式只有导航被激活的时候才会生效
          2.Navlink其实就是一个a标签
          3.这里点击了navlink，navlink自身不会消失的原因是：
            它本身就在一级路由HOME中，点击他进行跳转的页面仅仅是二级路由部分，
            每个一级路由代表一个大页面，每个二级路由为他一级路由的子集
        */}
        <NavLink to="/recommend" activeClassName="selected"><TabItem><span > 推荐 </span></TabItem></NavLink>
        <NavLink to="/singers" activeClassName="selected"><TabItem><span > 歌手 </span></TabItem></NavLink>
        <NavLink to="/rank" activeClassName="selected"><TabItem><span > 排行榜 </span></TabItem></NavLink>
      </Tab>
      <Player></Player>
    </div>
  )
}

export default React.memo (Home);