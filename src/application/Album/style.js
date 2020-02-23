import styled from'styled-components';
import style from '../../assets/global-style';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: #fff;

  
  transform-origin: right bottom;/*绕右下角进行旋转 */

  /*也就是说整个动画就是进行左右100%自身宽度的平移与角度30度的旋转的结合 */
  &.fly-enter, &.fly-appear{
    /* 
    rotate：旋转  
    在2d中不区分xy  
    3d中有 
    绕x轴旋转：rotateX 
    绕Y轴旋转：rotateY 
    绕Z轴旋转：rotateZ(相当于2D旋转) */
    transform: rotateZ(30deg) translate3d(100%, 0, 0);
    /*
    transform：平移
    2d中根据XY轴平移指定单位 translate(50px,100px)
    3d中多了一个沿Z轴的平移  这是干嘛用的？？？？？
     */
  }
  &.fly-enter-active, &.fly-appear-active{
    transition: transform .3s;
    transform: rotateZ(0deg) translate3d(0, 0, 0);
  }
  &.fly-exit{
    transform: rotateZ(0deg) translate3d(0, 0, 0);
  }
  &.fly-exit-active{
    transition: transform .3s;
    transform: rotateZ(30deg) translate3d(100%, 0, 0);
  }
`;

export const TopDesc = styled.div`
  background-size: 100%;
  padding: 5px 20px;
  padding-bottom: 50px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
<<<<<<< HEAD
  box-sizing: border-box;/*这玩意儿的作用是啥？？？？/ */
=======
  box-sizing: border-box;
>>>>>>> 96975c7fce1c6ca845d39bb28756c500ad7a92d8
  width: 100%;
  height: 275px;
  position: relative;
  .background{
    z-index: -1;
    background: url(${props => props.background}) no-repeat;
    background-position: 0 0;
    background-size: 100% 100%;
    position: absolute;
    width: 100%;
    height: 100%;
<<<<<<< HEAD
    filter: blur(20px);/*高斯模糊 */
    /*下面这个filter是干嘛用的？？？？？？？？？ */
=======
    filter: blur(20px);
>>>>>>> 96975c7fce1c6ca845d39bb28756c500ad7a92d8
    .filter{
      position: absolute;
      z-index: 10;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.2);
    }
  }
<<<<<<< HEAD
  /*这个img_wrapper明明和background平级  是怎么做到嵌套在background里面的？？？我想不明白 */
  /*这里与前面推荐列表一样  三个部分：图片 播放量遮罩  播放量文字 */
=======
>>>>>>> 96975c7fce1c6ca845d39bb28756c500ad7a92d8
  .img_wrapper{
    width: 120px;
    height: 120px;
    position: relative;         
    .decorate {
      position: absolute;
      top: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient(hsla(0,0%,43%,.4),hsla(0,0%,100%,0));
    }
    .play_count {
      position: absolute;
      right: 2px;
      top: 2px;
      font-size: ${style["font-size-s"]};
      line-height: 15px;
      color: ${style["font-color-light"]};
      .play{
        vertical-align: top;
      }
    }
    img{
      width: 120px;
      height: 120px;
      border-radius:3px;
    }
  }
<<<<<<< HEAD
  /*右侧歌单名称以及歌单作者信息 */
=======
>>>>>>> 96975c7fce1c6ca845d39bb28756c500ad7a92d8
  .desc_wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 120px;
    padding: 0 10px;
    .title{
      max-height: 70px;
      color: ${style["font-color-light"]};
      font-weight: 700;
      line-height: 1.5;
      font-size: ${style["font-size-l"]};
    }
    .person{
      display: flex;
      .avatar{
        width: 20px;
        height: 20px;
        margin-right: 5px;
        img{
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .name {
        line-height: 20px;
        font-size: ${style["font-size-m"]};
        color: ${style["font-color-desc-v2"]};
      }
    }
  }
`;

export const Menu = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
<<<<<<< HEAD
  box-sizing: border-box;/*无视上面元素的padding和margin会不会是这玩意儿起到了作用？？？？？？ */
=======
  box-sizing: border-box;
>>>>>>> 96975c7fce1c6ca845d39bb28756c500ad7a92d8
  padding: 0 30px 20px 30px;
  margin: -100px 0 0 0;
  >div {
    display: flex;
    flex-direction: column;
    line-height: 20px;
    text-align: center;
    font-size: ${style["font-size-s"]};
    color: #3b1f1f;
    color: ${style["font-color-light"]};
<<<<<<< HEAD
    z-index:1000;/*所以这里设置z-index的目的是什么？？？ */
=======
    z-index:1000;
>>>>>>> 96975c7fce1c6ca845d39bb28756c500ad7a92d8
    font-weight: 500;
    .iconfont {
      font-size: 20px;
    }
  }
`;
export const SongList = styled.div`
<<<<<<< HEAD
/*这个又是怎么做到无视上一个组件的margin的？？？我现在一脸懵逼 */
=======
>>>>>>> 96975c7fce1c6ca845d39bb28756c500ad7a92d8
  border-radius: 10px;
  opacity: 0.98;
  ${props => props.showBackground ? `background: ${style["highlight-background-color"]}`: ""}
  .first_line {
<<<<<<< HEAD
    box-sizing: border-box;/*难道又是这玩意儿暗藏玄机？？？ */
    padding: 10px 0;
    margin-left: 10px;
    position: relative;
    justify-content: space-between;/*这里压根儿就没声明要flex布局  怎么就用起来justify-content属性了？？？ */
=======
    box-sizing: border-box;
    padding: 10px 0;
    margin-left: 10px;
    position: relative;
    justify-content: space-between;
>>>>>>> 96975c7fce1c6ca845d39bb28756c500ad7a92d8
    border-bottom: 1px solid ${style["border-color"]};
    .play_all {
      display: inline-block;
      line-height: 24px;
      color: ${style["font-color-desc"]};
      .iconfont {
        font-size: 24px;
        margin-right: 10px;
        vertical-align: top;
      }
      .sum {
        font-size: ${style["font-size-s"]};
        color: ${style["font-color-desc-v2"]};
      }
      >span {
        vertical-align: top;
      }
    }
    .add_list,.isCollected {
      display: flex;
      align-items: center;
      position: absolute;
      right: 0; top :0; bottom: 0;
      width: 130px;
      line-height: 34px;
      background: ${style["theme-color"]};
      color: ${style["font-color-light"]};
      font-size: 0;
      border-radius: 3px;
      vertical-align: top;
      .iconfont {
        vertical-align: top;
        font-size: 10px;
        margin: 0 5px 0 10px;
      }
      span {
        font-size: 14px;
        line-height: 34px;
      }
    }
    .isCollected {
      display: flex;
      background: ${style["background-color"]};
      color: ${style["font-color-desc"]};
    }
}
`
export const SongItem = styled.ul`
  >li {
    display: flex;
    height: 60px;
    align-items: center;  
    .index {
      flex-basis: 60px;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
    }
    .info {
      box-sizing: border-box;
      flex: 1;
      display: flex;
      height: 100%;
      padding: 5px 0;
      flex-direction: column;
      justify-content: space-around;
      border-bottom: 1px solid ${style["border-color"]};
      ${style.noWrap ()}/*//一行溢出了用...代替 */
      >span {
        ${style.noWrap ()}
      }
      >span:first-child {
        /*正如字面意思  该元素的父元素的首个子元素应用该样式
        即：<span>{item.name}</span> 该span应用该样式 */
        color: ${style["font-color-desc"]};
      }
      >span:last-child {
        /*正如字面意思  该元素的父元素的最后一个子元素应用该样式
        即：<span>{ getName (item.ar) } - { item.al.name }</span>
            该span应用该样式 */
        font-size: ${style["font-size-s"]};
        color: #bba8a8;
      }
    }
  }
`