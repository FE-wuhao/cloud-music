import { createGlobalStyle } from'styled-components';
//全局样式初始化，避免后面出现乱七八糟的问题
//这里的用法是es6中的标签模板
export const GlobalStyle = createGlobalStyle`
	html, body, div, span, applet, object, iframe,
	h1, h2, h3, h4, h5, h6, p, blockquote, pre,
	a, abbr, acronym, address, big, cite, code,
	del, dfn, em, img, ins, kbd, q, s, samp,
	small, strike, strong, sub, sup, tt, var,
	b, u, i, center,
	dl, dt, dd, ol, ul, li,
	fieldset, form, label, legend,
	table, caption, tbody, tfoot, thead, tr, th, td,
	article, aside, canvas, details, embed, 
	figure, figcaption, footer, header, hgroup, 
	menu, nav, output, ruby, section, summary,
	time, mark, audio, video {
		margin: 0;
		padding: 0;
		border: 0;
		font-size: 100%;
		font: inherit;
		vertical-align: baseline;
	}
	/* HTML5 display-role reset for older browsers */
	article, aside, details, figcaption, figure, 
	footer, header, hgroup, menu, nav, section {
		display: block;
	}
	body {
		line-height: 1;
	}
	html, body {
		background: #f2f3f4;;
	}
	ol, ul {
		list-style: none;
	}
	blockquote, q {
		quotes: none;
	}
	blockquote:before, blockquote:after,
	q:before, q:after {
		content: '';
		content: none;
	}
	table {
		border-collapse: collapse;
		border-spacing: 0;
	}
	a {
		text-decoration: none;
		color: #fff;
	}
`

/* 这里也算是明白了他的用意，把全局公共的样式提炼出来方便外部进行样式引用，但是对于这两个函数还需要在研究研究啥意思 */
// 扩大可点击区域：通过没有宽度和高度的伪元素，设置他的top、bottom、left、right，这四个量的值都是相对父元素的
//话又说来，父元素不就是需要扩大点击区域的元素吗，他的四维相对于父元素都放大了10px，那整体就胖了一圈
const extendClick = () => {
  return `
    position: relative;
    &:after {
      content: '';
      position: absolute;
      top: -10px; bottom: -10px; left: -10px; right: -10px;
    };
  `
}
// 一行文字溢出部分用... 代替  
//使用的时候运行该函数，返回模板字符串，达到样式声明的作用
//text-overflow:ellipsis：当文本溢出包含元素时，显示省略符号来代表被修剪的文本。
//overflow: hidden;当文本溢出包含元素时，内容会被修剪，并且其余内容是不可见的。
//white-space: nowrap;忽视原文中的换行空白，选择不换行。
const noWrap = () => {
  return `
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  `
}
const x="ceshi";
export default {
  'theme-color': '#d44439',
  'theme-color-shadow': 'rgba (212, 68, 57, .5)',
  'font-color-light': '#f1f1f1',
  'font-color-desc': '#2E3030',
  'font-color-desc-v2': '#bba8a8',// 略淡
  'font-size-ss': '10px',
  'font-size-s': '12px',
  'font-size-m': '14px',
  'font-size-l': '16px',
  'font-size-ll': '18px',
  "border-color": '#e4e4e4',
  'background-color': '#f2f3f4',
  'background-color-shadow': 'rgba (0, 0, 0, 0.3)',
  'highlight-background-color': '#fff',
  //这里到底是个什么用法？？？？？？？？？？？？？？？？？？？？？？？？？？？？？▲
  //2020/3/5 15:15 答：这里是ES6属性的简写 ES6允许在大括号内传入对象作为大括号所属对象的方法和属性
  //例：x=‘’;y=function(){};z={x,y,"j":""}  这里就传入了三种类型：已有对象、已有方法、新定义对象
  extendClick,
  noWrap,
  x
}