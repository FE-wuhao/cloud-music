```
**CloudMusic项目复盘**

1. 一、 **遇到的问题：**
2. 二、 **零碎知识点：**

1. **拼接字符串：**

&quot;${xx}&quot;    便捷点在于不用再像以前那样用多对双引号拼接多对字符串了

1. **Styled-component声明全局样式：**

export const GlobalStyle = createGlobalStyle``

通过createGlobalStyle声明全局样式，然后在项目根文件中导入即可

function App() {

  return (

    \&lt;Provider store={store}\&gt;

      \&lt;HashRouter\&gt;

        \&lt;GlobalStyle\&gt;\&lt;/GlobalStyle\&gt;

        \&lt;IconStyle\&gt;\&lt;/IconStyle\&gt;

        { renderRoutes(routes) }

      \&lt;/HashRouter\&gt;

    \&lt;/Provider\&gt;

  )

}

1. **模板字符串：**

ES6出现的，可以用来携带字符串，用反引号（`）表示。

用处1：保证多行字符串的原样式，即保留空格、换行等等。

用处2：配合${}使用，在字符串中嵌套变量或者函数运算

1. **ES6对象的简洁表示：**

例：const x=&#39;&#39;;

  const y=function(){};

  const z={

    x,

    y,

    &quot;j&quot;:&quot;&quot;

  }

这里就传入了三种类型：已有对象、已有方法、新定义对象

1. **路由传参：**

通过使用通配符向路由对应的组件传递参数，组件根据拿到的参数动态变换显示内容，同时地址栏的地址与传入的参数保持一致。

例：

  {

        path: &quot;/recommend/&quot;,

        component: SuspenseComponent (RecommendComponent),

        routes: [

          {

            path: &quot;/recommend/:id&quot;,

            component: SuspenseComponent (AlbumComponent)

          }

        ]

      },

Album组件通过props.match.params.id获取传入的歌单id，请求对应的歌曲资源渲染页面，同时路由也变成/recommend/:id，如下图 ![](data:image/*;base64,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)

1. **CSS样式最高优先级！Important**

例：

font-family: &quot;iconfont&quot; !important;

！important可以突破css引用的自然优先级，优先使用！Important标记的样式

1. **导航组件的保留：**

想要在导航以后组件还在的话只要将导航组件声明在导向页面的上级路由中即可。

1. **扩大点击区域：**

position: relative;

    &amp;:after {

      content: &#39;&#39;;

      position: absolute;

      top: -10px; bottom: -10px; left: -10px; right: -10px;

    };

原理：通过没有宽度和高度的伪元素，设置他的top、bottom、left、right，这四个量的值都是相对父元素的。话又说来，父元素不就是需要扩大点击区域的元素吗，他的四维相对于父元素都放大了10px，那整体就胖了一圈。

1. **&#39;\&gt;&#39;选择器**

&#39;\&gt;&#39;代表后代第一层选择器

1. **Flex布局常用属性：**

**主轴方向：**** flex-direction**

**flex-direction** : row | row-reverse | column | column-reverse;

row（默认值）：主轴为水平方向，起点在左端。

row-reverse：主轴为水平方向，起点在右端。

column：主轴为垂直方向，起点在上沿。

column-reverse：主轴为垂直方向，起点在下沿。

**项目溢出换行：**** flex-wrap**

**flex-wrap** : nowrap | wrap | wrap-reverse;

nowrap（默认）：不换行。

wrap：换行，第一行在上方。

wrap-reverse：换行，第一行在下方。

**★flex-flow：**** flex-flow**属性是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap。

**★**** 主轴对齐方式： ****justify-content**

**justify-content** : flex-start | flex-end | center | space-between | space-around;

flex-start（默认值）：左对齐

flex-end：右对齐

center： 居中

space-between：两端对齐，项目之间的间隔都相等。

space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。

**★**** 交叉轴对齐方式： ****align-items**

**align-items** : flex-start | flex-end | center | space-between | space-around | stretch;

flex-start：交叉轴的起点对齐。

flex-end：交叉轴的终点对齐。

center：交叉轴的中点对齐。

baseline: 项目的第一行文字的基线对齐。

stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。

**项目属性：**

**flex-grow** 属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。flex-grow: \&lt;number\&gt;

**flex-shrink** 属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。flex-shrink: \&lt;number\&gt;

**flex-basis** 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。flex-basis: \&lt;length\&gt; | auto;

**★**** flex**属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。flex: none | [\&lt;&#39;flex-grow&#39;\&gt; \&lt;&#39;flex-shrink&#39;\&gt;? || \&lt;&#39;flex-basis&#39;\&gt;]

**★**** align-self**属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。align-self: auto | flex-start | flex-end | center | baseline | stretch;

1. **immutable的多层级查询：**

 {a:1}

immutableData.get(&#39;a&#39;) 得到1。

{a:{b:2}}

immutableData.getIn([&#39;a&#39;, &#39;b&#39;]) 得到2。

1. **Swiper使用方法：**

  1.创建swiper容器，类名设置为&#39;slider-container&#39;

  2.在useeffect中实例化swiper对象，并配置好初始化的参数，将类名传入到该对象中去，以供其定位

  3.在swiper容器中创建div，类名&#39;swiper-wrapper&#39;，并在该div中插入轮播图图片数组，图片数组的使用需按照固定格式来，做好相关配置即可

**13.元素高度百分比设置无效的问题**

元素的高度默认是缺省值，所以特别要注意当高度设置为百分比时，父元素的高度要确定，否则设置无效，尤其是在height：100%时，最终可能会追溯到设置html，body的高度为100%

**14.display属性对布局带来的影响**

**块级元素：** 每个块级元素通常都会独占一行或者是多行，可以对其单独设置高度,宽度以及对齐等属性。

**特点：**

块级元素会独占一行

高度，行高，外边距和内边距都可以单独设置

宽度默认是容器的100%

可以容纳内联元素和其他的块级元素

**行内元素：** 不占有独立的区域，仅仅依靠自己的字体大小或者是图像大小来支撑结构。一般不可以设置宽度，高度以及对齐等属性。

**特点：**

和相邻的行内元素在一行上

高度和宽度无效，但是水平方向上的padding和margin可以设置，垂直方向上的无效

默认的宽度就是它本身的宽度

行内元素只能容纳纯文本或者是其他的行内元素（a标签除外）

**行内块级元素：**

和相邻的行内元素（行内块）在一行上，但是中间会有空白的间隙

默认的宽度就是本身内容的宽度

高度，行高，内边距和外边距都可以设置

**15.react-lazyload使用方法**

1.在图片的外面包裹一层LazyLoad，并设置placeholder属性为要懒加载时显示的内容（可以是图片或者其他）

2.向scroll的onscroll属性传入执行函数，当滑动的时候执行该函数，即传入forcecheck函数，作用是解除懒加载状态显示图片，实现手段是。。。有待考证

forcecheck

**16.占位容器的技巧**

容器的margin\padding使用百分比时是以父元素的width为基准的，所以&#39;padding-top: 100%&#39;就是父元素的width，同时不能使用margin的理由是如果用了margin容器就没有高度了，但是用padding有，因为默认的元素的高度是content的高度+padding的高度，如果用了margin，高度会受到挤压，反之padding则不会

**17.利用背景阴影做衬底的技巧**

background: linear-gradient(hsla(0,0%,43%,.4),hsla(0,0%,100%,0));

hsla(hue, saturation, lightness, alpha)

        hue- 色相:范围0-360，其中0 (或 360) 为红色, 120 为绿色, 240 为蓝色

        saturation - 饱和度：定义饱和度; 0% 为灰色， 100% 全色

        lightness - 亮度：定义亮度 0% 为暗, 50% 为普通, 100% 为白

        alpha - 透明度：定义透明度 0（透完全明） ~ 1（完全不透明）

linear-gradient(direction, color-stop1, color-stop2, ...)

        direction：  用角度值指定渐变的方向（或角度）。

        color-stop1, color-stop2,...：用于指定渐变的起止颜色。

**18.better-scroll使用步骤：**

1.创建一个div作为betterscroll的容器

2.创建一个bscroll对象，配置好bscroll的各项参数，并将该对象绑定到该div容器上

3.在useeffect中监听bscroll的各种状态，相应的做出相应的操作

**19.useImperativeHandle：**

useImperativeHandle限定了外部对ref定位到的元素的操作方式，只限定在useImperativeHandle提供了的操作方法范围内

本质是外部传入的ref只定位到函数组件，通过外部传入函数组件的ref调用useImperativeHandle给出的方法控制函数组件内部元素

需配合转发ref使用

1. **PropTypes：**

Proptypes帮助组件进行类型检查

例：

import PropTypes from &#39;prop-types&#39;;

class Greeting extends React.Component {

  render() {

    return (

      \&lt;h1\&gt;Hello, {this.props.name}\&lt;/h1\&gt;

    );

  }

}

Greeting.defaultProps

= {

  name: &quot;吴灏&quot;

};

Greeting.propTypes = {

  name: PropTypes.string

};

[https://zh-hans.reactjs.org/docs/typechecking-with-proptypes.html#\_\_\_gatsby](https://zh-hans.reactjs.org/docs/typechecking-with-proptypes.html#___gatsby)

1. **axios使用步骤：**

    1.创建一个axios实例并配置axios相关属性，export出去以供调用

    2.调用上一步创建好的axios实例，使用它的get，post...方法

3.可以设置拦截器在axios请求发出前和接收后对数据进行处理

export const baseUrl = &#39;http://111.229.243.7:3000/&#39;;

const axiosInstance = axios.create ({

  baseURL: baseUrl

});

axiosInstance.interceptors.response.use (

  res =\&gt; res.data,

  err =\&gt; {

    console.log (err, &quot;网络错误&quot;);

  }

);

1. **immutable的set和fromJS方法：**

在immutable.js中，object经过fromjs函数以后默认转成map，array经过fromjs以后默认转成list

          set方法在list和map中的使用：

    list：list.set(index, xx);

    map：map.set(&#39;key&#39;,xx)

1. **immutable的fromJS**

对于基本值类型无需进行fromjs转化即可存入immutable数据结构中了，因为fromJS的作用是将 JS 对象转换为 immutable 对象

1. **react-thunk源码分析**
2. **CSS动画的编写**

keyframes是专门用来写动画用的. &quot;from&quot; 和 &quot;to&quot;，等同于 0% 和 100%，0% 是动画的开始，100% 是动画的完成.

animation要规定至少两个属性：动画名称、动画时长

步骤：

1.编写keyframes

@keyframes myfirst

{

        from {background:red;}

        to {background:yellow;}

}

2.在animation属性调用keyframes

div

{

        animation:myfirst 5s;

}

1. **CSS过渡属性transition使用：**

语法：

        transition: property duration timing-function delay;

[property](https://links.jianshu.com/go?to=http://www.runoob.com/cssref/css3-pr-transition-property.html):规定应用过渡的 CSS 属性的名称(默认为all)。(可选)

[duration](https://links.jianshu.com/go?to=http://www.runoob.com/cssref/css3-pr-transition-duration.html):定义过渡效果花费的时间。默认是 0s。（必需）

[timing-function](https://links.jianshu.com/go?to=http://www.runoob.com/cssref/css3-pr-transition-timing-function.html):规定过渡效果的时间曲线。默认是 &quot;ease&quot;函数。(可选)

        [delay](https://links.jianshu.com/go?to=http://www.runoob.com/cssref/css3-pr-transition-delay.html):规定过渡效果何时开始。默认是 0s.(可选)

[timing-function](https://links.jianshu.com/go?to=http://www.runoob.com/cssref/css3-pr-transition-timing-function.html)表：

| 值 | 描述 |
| --- | --- |
| linear | 规定以相同速度开始至结束的过渡效果，即匀速。（等于 cubic-bezier(0,0,1,1)）。 |
| ease | 规定慢速开始，然后变快，然后慢速结束的过渡效果（cubic-bezier(0.25,0.1,0.25,1)）。 |
| ease-in | 规定以慢速开始的过渡效果（等于 cubic-bezier(0.42,0,1,1)）。 |
| ease-out | 规定以慢速结束的过渡效果（等于 cubic-bezier(0,0,0.58,1)）。 |
| ease-in-out | 规定以慢速开始和结束的过渡效果（等于 cubic-bezier(0.42,0,0.58,1)）。 |
| cubic-bezier(n,n,n,n) | 在 cubic-bezier 函数中定义自己的值。可能的值是 0 至 1 之间的数值。 |

例子：

        div

        {

            transition: width 2s;

        }

1. **CSS transform属性**
2. **CSS xx:nth-child(y)属性**

规定xx元素的父元素的第y个子元素的属性

例：这里就是让包裹2的span标签字体变红

\&lt;style\&gt;

        div:nth-child(2){

           Color:red

        }

\&lt;/style\&gt;

\&lt;div\&gt;

        \&lt;span\&gt;1\&lt;/span\&gt;

        \&lt;span\&gt;2\&lt;/span\&gt;

\&lt;/div\&gt;

1.
```