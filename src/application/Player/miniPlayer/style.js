import styled, {keyframes} from 'styled-components';
import style from '../../../assets/global-style';

//360°旋转的动画
const rotate = keyframes`
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
`

export const MiniPlayerContainer = styled.div`
  display: flex;
  align-items: center;

  /*贴在最下方的高度为60px的矩形区域 */
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  height: 60px;

  background: ${style["highlight-background-color"]};

  /*与之前一样是页面过渡动画 */
  /*不过这里的过渡效果只有mini播放器的y轴上下移动 */
  &.mini-enter{
    transform: translate3d(0, 100%, 0);
  }
  &.mini-enter-active{
    transform: translate3d(0, 0, 0);
    transition: all 0.4s;
  }
  &.mini-exit-active{
    transform: translate3d(0, 100%, 0);
    transition: all .4s
  }

  .icon{
    /*width：40px的主轴+30px的padding=70px */
    flex: 0 0 40px;/* 存在剩余空间，也不放大 
                      空间不足也不缩小  
                      项目占据主轴空间为40px */
    width: 40px;/*这里已经声明了主轴的宽度再声明这个width的意义是什么？？？？？ */
    height: 40px;
    padding: 0 10px 0 20px;
    .imgWrapper{
      width: 100%;
      height: 100%;
      img{
        border-radius: 50%;
        &.play{
          animation: ${rotate} 10s infinite;
          &.pause{/*这里还学到一个小诀窍：在play中定义pause 则同时声明play和pause时 会执行pause */
            animation-play-state: paused; /* 
                                            animation-play-state规定动画正在运行还是暂停
                                            paused：暂停
                                            running：播放
                                          */
          }
        }
      }
    }
  }
  .text{
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .name{
      margin-bottom: 2px;
      font-size: ${style["font-size-m"]};
      color: ${style["font-color-desc"]};
      ${style.noWrap()}
    }
    .desc {
      font-size: ${style["font-size-s"]};
      color: ${style["font-color-desc-v2"]};
      ${style.noWrap()}
    }
  }
  .control{
    /*这里主轴的宽度加上padding的长度就是组件的宽度  
    这里text的宽度没设置  随着其他三个宽度的变化分配剩余宽度 */
    flex: 0 0 30px;
    padding: 0 10px;
    .iconfont, .icon-playlist{
      font-size: 30px;
      color: ${style["theme-color"]};
    }
    .icon-mini{
      font-size: 16px;
      position: absolute;
      left: 8px;
      top: 8px;
      &.icon-play{
        left: 9px
      }
    }
  }
`