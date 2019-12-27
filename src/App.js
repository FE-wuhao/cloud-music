import React from 'react'
import { GlobalStyle } from  './style'
import { renderRoutes } from 'react-router-config'
import { IconStyle } from './assets/iconfont/iconfont'
import routes from './routes/index.js'
import { HashRouter } from 'react-router-dom';
/*
    通过一个路由的配置文件设定好路由结构，
    在该路由文件中引用所有节点所需要用到的组件，
    最后在根节点通过声明
*/
function App() {
  return (
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        { renderRoutes(routes) }
      </HashRouter>
  )
}

export default App;