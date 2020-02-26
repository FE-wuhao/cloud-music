import styled from 'styled-components';
import style from '../../assets/global-style';

export const CircleWrapper = styled.div`
  position: relative;
  circle{
    stroke-width: 8px;
    transform-origin: center;
    &.progress-background{
      transform: scale(0.9);
      stroke: ${style["theme-color-shadow"]};/*边框颜色 */
    }
    &.progress-bar{
      transform: scale(0.9) rotate(-90deg);/*这里缩小和旋转的意义是什么呢？还有上面这个背景的意义又是什么 */
      stroke: ${style["theme-color"]};
    }
  }
`