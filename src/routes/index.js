import React from 'react';
import { Redirect } from "react-router-dom";
import Home from '../application/Home';
import Recommend from '../application/Recommend';
import Singers from '../application/Singers';
import Rank from '../application/Rank';
import Album from '../application/Album';
import Singer from '../application/Singer';
import Search from '../application/Search';

//最外层用数组包裹是因为顶层路由不一定只有一个页面，每一个具体的路由配置都是一个对象
export default [
  {
    path: "/",
    component: Home,
    routes: [
      {
        path: "/",
        exact: true,
        render: () => (
          <Redirect to={"/recommend"}/>
        )
      },
      {
        path: "/recommend/",
        component: Recommend,
        routes: [
          {
            path: "/recommend/:id",//带参数的路由 通配recommend下所有的子路由 且路由地址为/recommend/:id 展示组件是Album  Album的内容根据id发送请求获取
            component: Album
          }
        ]
      },
      {
        path: "/singers",
        component: Singers,
        key: "singers",//同理  这边的key是用来干嘛的
        routes: [
          {
            path: "/singers/:id",
            component: Singer
          }
        ]
      },
      {
        path: "/rank",
        component: Rank,
        key: "rank",//这里为什么跟其他路由不一样多了个key？
        routes: [
          {
            path: "/rank/:id",
            component: Album
          }
        ]
      },
      {
        path: "/search",
        exact: true,
        key: "search",
        component: Search
      } 
    ]
  }
]
//TODO:到了榜单的路由部分了  明天继续 2020/2/20 23：26：00