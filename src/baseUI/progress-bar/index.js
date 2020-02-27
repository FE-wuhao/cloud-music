import React, {useEffect, useRef, useState } from 'react';
import { prefixStyle } from './../../api/utils';
import {ProgressBarWrapper} from './style'

function ProgressBar(props) {
  const progressBar = useRef();//进度条的ref
  const progress = useRef();//当前播放进度条的ref
  const progressBtn = useRef();//进度调节按钮的容器的ref
  const [touch, setTouch] = useState({});

  const { percent } = props;
  const { percentChange } = props;
  const progressBtnWidth = 16;  
  const transform = prefixStyle('transform');

  useEffect(() => {
    if(percent >= 0 && percent <= 1 && !touch.initiated) {
      /*真实进度条的长度=原始进度条的总长度-进度调节按钮的直径*/
      const barWidth = progressBar.current.clientWidth - progressBtnWidth;
      /*偏移量=真实进度条的长度*播放进度百分比 */
      const offsetWidth = percent * barWidth;
      _offset(offsetWidth);
    }
    // eslint-disable-next-line
  }, [percent]);
  //计算出当前的百分比并传递给父组件
  const _changePercent = () => {
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    //百分比=红色进度条长度/黑色进度条长度
    const curPercent = progress.current.clientWidth / barWidth;
    percentChange(curPercent);
  }
  // 红色进度条和进度调节按钮的偏移（相对于播放原点进行的偏移）
  const _offset = (offsetWidth) => {
    progress.current.style.width = `${offsetWidth}px`;//设定当前播放进度条宽度为偏移量offsetWidth
    progressBtn.current.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;/*按钮同步偏移相同数值 */
  };
  //点击进度条的处理事件
  const progressClick = (e) => {
    // rect 是一个具有四个属性left、top、right、bottom的DOMRect对象
    const rect = progressBar.current.getBoundingClientRect();//获取总进度条的rect
    //偏移量=点击点相对于视口左边界的值-进度条的左边界相对于视口左边界的值
    const offsetWidth = e.pageX - rect.left;//e.pageX:相对于浏览器内容区域的左上角的X值
    _offset(offsetWidth);
    _changePercent();
  };
  /*进度条滑动的相关处理事件 */
  const progressTouchStart = (e) => {
    const startTouch = {};
    startTouch.initiated = true;//initial为true表示滑动动作开始了
    startTouch.startX = e.touches[0].pageX;// 滑动开始时横向坐标
    startTouch.left = progress.current.clientWidth;// 当前progress长度
    setTouch(startTouch);
  }; 
  const progressTouchMove = (e) => {
    if(!touch.initiated) return;
    const deltaX = e.touches[0].pageX - touch.startX;//滑动距离 
    const barWidth = progressBar.current.clientWidth - progressBtnWidth; //去除按钮的进度条的长度
    //偏移距离=当前已播放进度条长度+手指划动按钮的距离
    //如果偏移量超过了进度条的最大长度则取进度条的最大长度
    //如果偏移量小于0则取0
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth);
    _offset(offsetWidth);
  };
  const progressTouchEnd = (e) => {
    const endTouch = JSON.parse(JSON.stringify(touch));//获取当前的touch
    endTouch.initiated = false;//更改touch对象的initiated为false，以防止触发progressTouchMove事件
    setTouch(endTouch);//更新全局的touch的值
    _changePercent();
  };

  return (
    <ProgressBarWrapper>
      <div className="bar-inner" ref={progressBar} onClick={progressClick} >{/*纯黑进度条 */}
        <div className="progress" ref={progress}></div>{/*红色当前播放进度条 */}
        <div className="progress-btn-wrapper" ref={progressBtn}
            onTouchStart={progressTouchStart}
            onTouchMove={progressTouchMove}
            onTouchEnd={progressTouchEnd}
        >
          <div className="progress-btn"></div>{/*进度条上的原型拉动按钮 */}
        </div>
      </div>
    </ProgressBarWrapper>
  )
}

export default ProgressBar;