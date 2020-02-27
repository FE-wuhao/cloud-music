import styled from 'styled-components';
import style from '../../assets/global-style';

export const ProgressBarWrapper = styled.div`
  height: 30px;
  .bar-inner{
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, .3);
    .progress{
      position: absolute;
      height: 100%;
      background: ${style["theme-color"]};
    }
    .progress-btn-wrapper{
      position: absolute;
      left: -7px;/*我觉得这里不对，小圆的直径是16px，容器的宽度是30px，
                  那么应该是向左平移7px正好是的圆的左切线与进度条左边界重合，而不是8px */
      top: -13px;/*容器高度30px，进度条高度4px，所以容器整体向上平移13px，这样圆心正好在进度条中心线上 */
      width: 30px;
      height: 30px;
      .progress-btn{
        position: relative;
        top: 7px;/*容器的宽高都是30px 按钮的直径是16px  所以左上都要留出7px空间使得按钮居中 */
        left: 7px;
        box-sizing: border-box;/*border-box：宽高的范围是border+padding+content 
                                 content-box:宽高的范围是content*/
        width: 16px;
        height: 16px;
        border: 3px solid ${style["border-color"]};
        border-radius: 50%;
        background: ${style["theme-color"]};
      }
    }
  }
`