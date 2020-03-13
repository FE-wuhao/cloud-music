import styled, { keyframes } from "styled-components";
import style from "../../../assets/global-style";

const rotate = keyframes`
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
`;
export const NormalPlayerContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  background: ${style["background-color"]};
  /*这个插件类名的渲染过程是：
      enter->enter-active->enter-done
      exit->exit-active->exit-done
   */

   /*过渡属性transition
        transition: property duration timing-function delay

        transition 属性是一个简写属性，用于设置四个过渡属性：
        transition-property     规定设置过渡效果的 CSS 属性的名称。
        transition-duration     规定完成过渡效果需要多少秒或毫秒。
        transition-timing-function     规定速度效果的速度曲线。
        transition-delay           定义过渡效果何时开始。
        注：请始终设置 transition-duration属性，否则时长为 0，就不会产生过渡效果。
    */
  &.normal-enter,&.normal-exit-done {
    .top {
      transform: translate3d(0, -100px, 0);/*标题缩上去 */
    }
    .bottom {
      transform: translate3d(0, 100px, 0);/*工具栏缩下去 */
    }
  }
  &.normal-enter-active,&.normal-exit-active {
    .top,.bottom {
      transform: translate3d(0, 0, 0);/*标题下拉工具栏上拉 */
      /*所有属性  在0.4S内慢速生效  速度曲线为cubic-bezier(0.86, 0.18, 0.82, 1.32) */
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
    opacity: 1;
    transition: all 0.4s;
  }
  &.normal-exit-active {
    opacity: 0;
  }
  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(20px);
    &.layer {
      background: ${style["font-color-desc"]};
      opacity: 0.3;
      filter: none;
    }
  }
`;
export const Top = styled.div`
  position: relative;
  margin-bottom: 25px;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .iconfont {
      display: block;
      padding: 9px;
      font-size: 24px;
      color: ${style["font-color-desc"]};
      font-weight: bold;
      transform: rotate(90deg);
    }
  }
  .title {
    width: 70%;
    margin: 0 auto;
    line-height: 40px;
    text-align: center;
    font-size: ${style["font-size-l"]};
    color: ${style["font-color-desc"]};
    ${style.noWrap()};
  }
  .subtitle {
    line-height: 20px;
    text-align: center;
    font-size: ${style["font-size-m"]};
    color: ${style["font-color-desc-v2"]};
    ${style.noWrap()};
  }
`;
export const Middle = styled.div`
  position: fixed;
  width: 100%;
  top: 8%;
  bottom: 170px;
  white-space: nowrap;
  font-size: 0;
  overflow: hidden;
  .fade-enter {
    opacity: 0;
  }
  .fade-enter-active {
    opacity: 1;
    transition: all 0.4s;
  }
  .fade-enter-done {
    transition: none;
  }
  .fade-exit-active {
    opacity: 0;
  }
  .fade-exit-done {
    opacity: 0;
  }
`;
export const CDWrapper = styled.div`
  position: absolute;
  margin: auto;/*横竖都居中 */
  top: 10%;
  left: 0;
  right: 0;
  width: 80%;
  box-sizing: border-box;
  height: 80vw;
  .cd {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    .image {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid rgba(255, 255, 255, 0.1);
    }
    .play {
      animation: ${rotate} 20s linear infinite;
      &.pause {
        animation-play-state: paused;
      }
    }
  }
  .playing_lyric {
    margin-top: 20px;
    font-size: 14px;
    line-height: 20px;
    white-space: normal;
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const Bottom = styled.div`
  position: absolute;
  bottom: 50px;
  width: 100%;
`;
export const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin: 0px auto;
  padding: 10px 0;
  .time {
    color: ${style["font-color-desc"]};
    font-size: ${style["font-size-s"]};
    flex: 0 0 30px;
    line-height: 30px;
    width: 30px;
    &.time-l {
      text-align: left;
    }
    &.time-r {
      text-align: right;
    }
  }
  .progress-bar-wrapper {
    flex: 1;
  }
`;
export const Operators = styled.div`
  display: flex;
  align-items: center;
  .icon {
    font-weight: 300;
    flex: 1;
    color: ${style["font-color-desc"]};
    &.disable {
      color: ${style["theme-color-shadow"]};
    }
    i {
      font-weight: 300;
      font-size: 30px;
    }
  }
  .i-left {
    text-align: right;
  }
  .i-center {
    padding: 0 20px;
    text-align: center;
    i {
      font-size: 40px;
    }
  }
  .i-right {
    text-align: left;
  }
  .icon-favorite {
    color: ${style["theme-color"]};
  }
`;
export const LyricContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;
export const LyricWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  p {
    line-height: 32px;
    color: rgba (255, 255, 255, 0.5);
    white-space: normal;
    font-size: ${style["font-size-l"]};
    &.current {
      color: #fff;
    }
    &.pure {
      position: relative;
      top: 30vh;
    }
  }
`;