import styled from'styled-components';
import style from '../../assets/global-style';

export const ListWrapper = styled.div`
  max-width: 100%;/*默认值是none，也就是不做限制，这里设置100%的用意是什么？搞不清楚。 
                    max-width: 100%是如果指定元素的宽度不超过父元素的宽度，则大小不变，如果超过了父元素的宽度，则将宽度收缩为父元素的宽度。
                    */
  .title {
    font-weight: 700;
    padding-left: 6px;
    font-size: 14px;
    line-height: 60px;
  }
`;
export const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`;

export const ListItem = styled.div`
  position: relative;
  width: 32%;

  .img_wrapper {
    position: relative;
    /* height: 0;  */
    /* 全靠这个'padding-top: 100%'把img框的高度撑起来了,
    容器的margin\padding使用百分比时是以父元素的width为基准的，
    所以这里的'padding-top: 100%'就是父元素的width，同时这里不能
    使用margin的理由是如果用了margin容器就没有高度了，但是用padding有，
    而img是容器的子元素，他的height：100%取决于容器的高度，如果用了margin，
    img高度就为0，反之padding则不会
    */
    padding-top: 100%; 
      /*decorate的目的是为了img右上角的文字做遮罩，防止出现白色图片看不清字 */
    .decorate {
      position: absolute;
      top: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient (hsla (0,0%,43%,.4),hsla (0,0%,100%,0));
    }
    .play_count {
      position: absolute;
      right: 2px;
      top: 2px;
      font-size: ${style["font-size-s"]};
      line-height: 15px;
      color: ${style["font-color-light"]};
      .play {
        vertical-align: top;
      }
    }
    img {
      position: absolute;
      top:0;
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
  }
  .desc {
      overflow: hidden;
      margin-top: 2px;
      padding: 0 2px;
      height: 50px;
      text-align: left;
      font-size: ${style["font-size-s"]};
      line-height: 1.4;
      color: ${style["font-color-desc"]};
    }
`;