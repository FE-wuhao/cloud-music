import React, { useEffect, useState } from 'react';
import { SliderContainer } from './style';
import "swiper/css/swiper.css";
import Swiper from "swiper";

/*swiper的使用步骤：
  与better-scroll类似
  1.创建swiper容器，类名设置为‘lider-container’
  2.在useeffect中实例化swiper对象，并配置好初始化的参数，将类名传入到该对象中去，以供其定位
  3.在swiper容器中创建div，类名‘swiper-wrapper’，并在该div中插入轮播图图片数组，图片数组的使用需按照固定格式来，做好相关配置即可
*/

function Slider (props) {
  const [sliderSwiper, setSliderSwiper] = useState (null);
  //对象解构，获取传入的图片资源
  const { bannerList } = props;

  useEffect (() => {
    if (bannerList.length && !sliderSwiper){
        //进行swiper的初始化配置
        let sliderSwiper = new Swiper (".slider-container", {
          loop: true,//到最后一张幻灯片结束后自动切换到第一张
          autoplay: true,//自动切换幻灯片，默认三秒
          autoplayDisableOnInteraction: false,//用户操作swiper之后自动切换不会停止
          pagination: {el:'.swiper-pagination'},//设置分页器，即那几个小圆点
        });
        setSliderSwiper (sliderSwiper);
    }
  }, [bannerList.length, sliderSwiper]);//[bannerList.length, sliderSwiper]仅仅在他们的值发生改变的时候才重新渲染他们的值
  
  return (
    <SliderContainer>
      <div className="before"></div> {/* 通过在同层设置了一个空的div并调整其背景色做了遮罩 */}
      {/* 使用swiper的固定格式1 */}
      <div className="slider-container">
        {/* 使用swiper的固定格式2 */}
        <div className="swiper-wrapper">
          {
            bannerList.map (slider => {
              return (
                  //使用swiper的固定格式3
                <div className="swiper-slide" key={slider.imageUrl}>
                  <div className="slider-nav">
                    <img src={slider.imageUrl} width="100%" height="100%" alt="推荐" />
                  </div>
                </div>
              );
            })
          }
        </div>
        <div className="swiper-pagination"></div>
      </div> 
    </SliderContainer>
  );
}

export default React.memo (Slider);