import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducer'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
//外面包裹的composeEnhancers函数是为了方便浏览器显示redux数据
const store = createStore (reducer, composeEnhancers (
  applyMiddleware (thunk)
));

export default store;