import React, {useState, useImperativeHandle, forwardRef} from './node_modules/react';
import { CSSTransition } from './node_modules/react-transition-group';
import {ToastWrapper} from './style'

//外面组件需要拿到这个函数组件的ref，因此用forwardRef
const Toast = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState('');
  const {text} = props;
  //外面组件拿函数组件ref的方法，用useImperativeHandle这个hook
  useImperativeHandle(ref, () => ({
    show() {
      // 做了防抖处理
      if(timer) clearTimeout(timer);
      setShow(true);
      setTimer(setTimeout(() => {
        setShow(false)
      }, 3000));
    }
  }))
  return (
    <CSSTransition in={show} timeout={300} classNames="drop" unmountOnExit>
      <ToastWrapper>
        <div className="text">{text}</div>
      </ToastWrapper>
    </CSSTransition>
  )
});

export default React.memo(Toast);