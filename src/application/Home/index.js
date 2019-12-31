import React from 'react';
import { renderRoutes } from "react-router-config";
import { 
  Top,
  Tab,
  TabItem, } from './style';
import { NavLink } from 'react-router-dom';
/*
  嵌套路由需要在产生嵌套的父组件内再次声明renderRoutes
  重点： 每个组件的props默认都携带了route对象，
        且route对象的内容与routes配置文件中的内容保持一致。
*/
function Home (props) {
  const  {route}  = props;//对象的解构，因为props里面只有一个对象route

  return (
    <div>
      <Top>
        <span className="iconfont menu">&#xe65c;</span>
        <span className="title">WebApp</span>
        <span className="iconfont search">&#xe62b;</span>
      </Top>
      <Tab>
        {/* 
          1.activeClassName所携带的样式只有导航被激活的时候才会生效
          2.Navlink其实就是一个a标签
        */}
        <NavLink to="/recommend" activeClassName="selected"><TabItem><span > 推荐 </span></TabItem></NavLink>
        <NavLink to="/singers" activeClassName="selected"><TabItem><span > 歌手 </span></TabItem></NavLink>
        <NavLink to="/rank" activeClassName="selected"><TabItem><span > 排行榜 </span></TabItem></NavLink>
      </Tab>
      { renderRoutes (route.routes) }
    </div>
  )
}

export default React.memo (Home);