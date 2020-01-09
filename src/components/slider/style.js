import styled from'styled-components';
import style from '../../assets/global-style';

export const SliderContainer = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  /* 大致可以判断这里的height是无意义的，
     因为百分比高度取决于父元素的高度，它的父元素使body和html，
     如果不设置body和html的高度，那么百分比高度设置就是无效的，
     所以它的高度只取决于它内部的轮播图的高度 */
  /* height: 100%;  */
  /* margin: auto; */
  background: white;
  .before {
    position: absolute;
    top: 0;
    height: 60%;
    width: 100%;
    background: ${style["theme-color"]};
  }
  .slider-container {
    position: relative;
    width: 98%;
    height: 160px;
    overflow: hidden;/* 设置为一旦元素溢出就隐藏 */
    margin: auto;
    border-radius: 6px;
    .slider-nav {
      /* 不能理解为什么要设置为绝对定位，
        不还是相对于父元素进行高度设置吗？
        直接设置height：100%不就达成目的了吗。。。 */
      /* position: absolute;
      display: block; */
      width: 100%;
      height: 100%;
    }
    .swiper-pagination-bullet-active {
      background: ${style["theme-color"]};
    }
  }
`