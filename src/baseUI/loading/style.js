import styled, { keyframes } from'styled-components';
import style from '../../assets/global-style';

//keyframes是专门用来写动画用的
//动画要规定至少两个属性：动画名称、动画时长
// "from" 和 "to"，等同于 0% 和 100%，0% 是动画的开始，100% 是动画的完成
//这里是一个非常简单的动画，XY同时从0到1再到0
const loading = keyframes`
  0%, 100% {
    transform: scale(0.0);
  }
  50% {
    transform: scale(1.0);
  }
`
export const LoadingWrapper = styled.div`
  >div {
    position: fixed;
    z-index: 1000;
    left: 0; 
    right: 0;  
    top: 0;
    bottom: 0;
    margin: auto;/* 用来居中 */
    width: 60px;
    height: 60px;
    opacity: 0.6;
    border-radius: 50%;
    background-color: ${style["theme-color"]};
    /* 完成动画所花的时间1.4s 无限次播放 由慢到快 */
    animation: ${loading} 1.4s infinite ease-in;
  }
  /* 规定属于其父元素的第二个子元素的每个div的animation-delay属性 */
  >div:nth-child(2) {
    /* 动画开始之前的延迟为0.7s */
    animation-delay: -0.7s;
  }
`