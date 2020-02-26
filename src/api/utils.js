import { RankTypes } from "./config";

export const getCount = (count) => {
    if (count < 0) return;
    if (count < 10000) {
      return count;
    } else if (Math.floor (count / 10000) < 10000) {
      return Math.floor (count/1000)/10 + "万";
    } else  {
      return Math.floor (count / 10000000)/ 10 + "亿";
    }
  }

  // 防抖函数
export const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout (timer);
    }
    timer = setTimeout (() => {
      func.apply (this, args);
      clearTimeout (timer);
    }, delay);
  }
}

/*
排行榜单分为两个部分，一部分是官方榜，另一部分是全球榜
官方榜单数据有 tracks 数组，而全球榜没有，以此为依据进行数据数组的分离，
查出具体的索引位置以后返回索引
*/
export const filterIndex = rankList => {
  for (let i = 0; i < rankList.length - 1; i++) {
    if (rankList[i].tracks.length && !rankList[i + 1].tracks.length) {
      return i + 1;
    }
  }
};

//根据榜单名获取榜单编号：将榜单名与config中定义好的榜单一一对比  如果名字相同则返回该榜单名对应的key值
export const filterIdx = name => {
  for (var key in RankTypes) {
    if (RankTypes[key] === name) return key;
  }
  return null;
};

export const getName = list => {
  let str = "";
  list.map ((item, index) => {
    //如果是数组的第一个则直接返回‘歌手名’  否则返回‘/歌手名’
    str += index === 0 ? item.name : "/" + item.name;
    return item;
  });
  return str;
};

// 判断一个对象是否为空
export const isEmptyObject = obj => !obj//非假=真
 || Object.keys (obj).length === 0;//长度为0=真
 //真：空对象  假：非空对象

 //转换歌曲播放时间
export const formatPlayTime = interval => {
  interval = interval | 0;
  const minute = (interval / 60) | 0;
  const second = (interval % 60).toString().padStart(2, "0");
  return `${minute}:${second}`;
};

// 给css3相关属性增加浏览器前缀，处理浏览器兼容性问题
let elementStyle = document.createElement("div").style;
/*vendor：浏览器类型
  查询的实现手段：通过创建一个div标签，
  获取该标签的style属性，并且通过比对transform来确认浏览器的型号
*/
let vendor = (() => {
  //首先通过transition属性判断是何种浏览器
  let transformNames = {
    webkit: "webkitTransform",
    Moz: "MozTransform",
    O: "OTransfrom",
    ms: "msTransform",
    standard: "Transform"
  };
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }
  return false;
})();
//有了浏览器型号再将需要改造的样式名称改造  如：‘transform’改造成‘webkitTransform’
export function prefixStyle(style) {
  if (vendor === false) {
    return false;
  }
  if (vendor === "standard") {
    return style;
  }
  return vendor //浏览器前缀
  + style.charAt(0).toUpperCase() //首字母大写
  + style.substr(1);//首字母后面的部分
}