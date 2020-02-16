import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'//thunk的作用是处理异步操作  其中涉及的知识点太多  等到后面玩成了整体软件的涉及后再回过头来研究其源码☆☆☆☆☆☆☆☆☆☆☆☆☆☆
import reducer from './reducer'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//外面包裹的composeEnhancers函数是为了方便浏览器显示redux数据
/*
  createStore(reducer, preloadedState, enhancer)
  preloadedState：整个应用的初始化数据
  enhancer：applyMiddleware 中间件的使用 类型：function
*/
const store = createStore (reducer, composeEnhancers (
  applyMiddleware (thunk)
));

export default store;