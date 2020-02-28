import React, {useState, useImperativeHandle, forwardRef} from 'react';
import { CSSTransition } from 'react-transition-group';
import {ToastWrapper} from './style'

//外面组件需要拿到这个函数组件的ref，因此用forwardRef
const Toast = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);//开启\关闭动画
  const [timer, setTimer] = useState('');
  const {text} = props;
  //ref转发，将useImperativeHandle中定义的方法作为暴露对象暴露给外面传入的ref
  useImperativeHandle(ref, () => ({
    show() {
      // 做了防抖处理
      if(timer) clearTimeout(timer);//一旦触发show时间则重置timer
      setShow(true);//并设置启动开场动画
      setTimer(setTimeout(() => {
        setShow(false)//预定在3秒后关闭动画
      }, 3000));
    }
  }))
  return (
    <CSSTransition 
      in={show} 
      timeout={300} 
      classNames="drop" 
      unmountOnExit
    >
      <ToastWrapper>
        <div className="text">{text}</div>{/*模式提示文字 */}
      </ToastWrapper>
    </CSSTransition>
  )
});

export default React.memo(Toast);