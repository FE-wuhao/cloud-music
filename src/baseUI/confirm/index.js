import React, {forwardRef, useImperativeHandle, useState} from 'react';
import { CSSTransition } from 'react-transition-group';
import {ConfirmWrapper} from './style'
// import { fromJS } from 'immutable';

//其实作为一个模态框最好再加一个全屏的阴影遮罩 这样才能突出模态框
const Confirm = forwardRef((props, ref) => {
  const [show, setShow] = useState(false);
  const { text, cancelBtnText, confirmBtnText } = props;

  const {handleConfirm} = props;

  useImperativeHandle(ref, () => ({
    show() {
      setShow(true);
    }
  }));
  // style={{display: show ? "block": "none"}}
  return (
    <CSSTransition classNames="confirm-fade" timeout={300} appear={true} in={show}>
      <ConfirmWrapper style={{display: show ? "block": "none"}} onClick={e => e.stopPropagation()}>
        <div>
          <div className="confirm_content">
            <p className="text">{text}</p>
            <div className="operate" >
              <div className="operate_btn left" onClick={() => setShow(false)}>{cancelBtnText}</div>
              <div className="operate_btn" onClick={() => { setShow(false); handleConfirm();}}>{confirmBtnText}</div>
            </div>
          </div>
        </div>
      </ConfirmWrapper>
    </CSSTransition>
  )
})

export default React.memo(Confirm);