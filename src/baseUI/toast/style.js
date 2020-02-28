import style from '../../assets/global-style';
import styled from 'styled-components';

export const ToastWrapper = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  height: 50px;
  /* background: ${style["highlight-background-color"]}; */
  &.drop-enter{/*先透明并下移 */
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  &.drop-enter-active{/*再显现并在0.3S内上移 */
    opacity: 1;
    transition: all 0.3s;
    transform: translate3d(0, 0, 0);
  }
  &.drop-exit-active{
    opacity: 0;
    transition: all 0.3s;/*为什么都显示透明了这个过渡效果还能显现 */
    transform: translate3d(0, 100%, 0);
  }
  .text{
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: ${style["font-size-l"]};
  }
`