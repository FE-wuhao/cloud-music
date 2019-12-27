import React from 'react';
import { renderRoutes } from "react-router-config";
/*
  嵌套路由需要在产生嵌套的父组件内再次声明renderRoutes
  重点： 每个组件的props默认都携带了route对象，
        且route对象的内容与routes配置文件中的内容保持一致。
*/
function Home (props) {
  const  {route}  = props;//对象的解构，因为props里面只有一个对象route

  return (
    <div>
      <div>Home</div>
      { renderRoutes (route.routes) }
    </div>
  )
}

export default React.memo (Home);