import React from 'react';
import {CircleWrapper} from './style'

function ProgressCircle(props) {
  //这里传入的radius=32
  const {radius, percent} = props;
  //整个背景的周长
  const dashArray = Math.PI * 100;//2πr  圆的周长
  //没有高亮的部分，剩下高亮的就是进度
  //percent从‘0~100%’也就是dashOffset从‘一个整圆周~0’的过程
  //也就是圆周的显示内容从‘全空’到‘全实’的过程
  const dashOffset = (1 - percent) * dashArray;

  return (
    <CircleWrapper>
      {/*
        viewBox：一个用来适配svg内容和这个容器本身的工具，
                 viewbox的大小是相对于svg的内容的，并不是相对于svg容器
                 先用viewbox将将好装下了svg的内容  再由svg自动适配viewbox，
                 使得viewbox能正好完整展示在svg中。具体过程就是一个可变大小
                 的框子（viewbox），去框svg的内容，然后svg容器又是个框子，不
                 过是固定大小的，这个时候viewbox调整自己的大小（svg的内容与viewbox同步变大变小），
                 正好能套进svg容器中，O了！

        viewBox="x, y, width, height" 
        x:左上角横坐标，y:左上角纵坐标，width:宽度，height:高度 
         */}
      <svg width={radius} height={radius} viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
        {/*
          fill：填充色 
          r:半径 
          cx：x坐标 
          cy：y坐标 
          transparent：透明色
          strokeDasharray：用于描绘出虚线边框  格式：strokeDasharray={线长度，缺口长度，线长度，缺口长度...}
                           strokeDasharray内容的数值个数必须是偶数个 否则自动复制原内容个数自动翻倍
                           例：321 -> 321321  这样321321就是一个循环周期了
          strokeDashoffset：起始点的偏移量  偏移方向：正左负右
        */}
        <circle className="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
        <circle className="progress-bar" r="50" cx="50" cy="50" fill="transparent" 
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}/>
      </svg>
      {props.children}
    </CircleWrapper>
  )
}

export default React.memo(ProgressCircle);