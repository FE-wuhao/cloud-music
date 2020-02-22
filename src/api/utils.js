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
    str += index === 0 ? item.name : "/" + item.name;
    return item;
  });
  return str;
};