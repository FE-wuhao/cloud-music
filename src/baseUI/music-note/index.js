import React, {useEffect, useImperativeHandle, useRef, forwardRef} from 'react';
import { prefixStyle } from './../../api/utils';
import {Container} from './style'
//尼玛！！！整半天原来是tradition的空格惹的祸！！！！！
const MusicNote = forwardRef ((props, ref) => {

  const iconsRef = useRef ();
  
  const ICON_NUMBER = 3;// 同时生成的音符的最大数量

  const transform = prefixStyle ("transform");

  //我知道了！！！这个tempNode就是个工具人 为的是生成一个带class带innnerhtml的div 嘻嘻嘻 这都被我发现了
  const createNode = (txt) => {
    const template = `<div class='icon_wrapper'>${txt}</div>`;
    let tempNode = document.createElement ('div');//创建一个div->tempNode
    tempNode.innerHTML = template;//div内部放入template，template内部再放入一个形参
    return tempNode.firstChild;
  }

  useEffect (() => {
    for (let i = 0; i < ICON_NUMBER; i++){
      let node = createNode (`<div class="iconfont">&#xe642;</div>`);
      iconsRef.current.appendChild (node);
    }
    // 类数组转换成数组，当然也可以用 [...xxx] 解构语法或者 Array.from ()
    let domArray = [].slice.call (iconsRef.current.children);//children指的是子元素 
                                                            //子元素的子元素就不管了 
                                                            //三个音符小蝌蚪到了domArray数组中了
    domArray.forEach (item => {
      item.running = false;//这个running应该是一个自定义属性
      //为每个小音符定义transitionend事件的执行内容
      item.addEventListener ('transitionend', function () {
        this.style['display'] = 'none';//不显示
        this.style[transform] = `translate3d(0, 0, 0)`;//移动到原来的位置
        this.running = false;//不运动

        let icon = this.querySelector ('div');//仅仅返回第一个匹配到的元素
        icon.style[transform] = `translate3d(0, 0, 0)`;//移动到原来的位置
      }, false);
    });
    //eslint-disable-next-line
  }, []);

  const startAnimation = ({x, y}) => {
    for (let i = 0; i < ICON_NUMBER; i++) {
      let domArray = [].slice.call (iconsRef.current.children)
      let item = domArray[i]
      // 选择一个空闲的元素来开始动画
      if (item.running === false) {
        item.style.left = x + "px";
        item.style.top = y + "px";
        item.style.display = "inline-block";
  
        setTimeout (() => {
          item.running = true;
          item.style[transform] = `translate3d(0, 750px, 0)`;
          let icon = item.querySelector ("div");
          icon.style[transform] = `translate3d(-40px, 0, 0)`;
        }, 20);
        break;
      }
    }
  };
  // 外界调用的 ref 方法
  useImperativeHandle (ref, () => ({
    startAnimation
  }));

  return (
    <Container ref={iconsRef}>
    </Container>
  )
})

export default React.memo (MusicNote);