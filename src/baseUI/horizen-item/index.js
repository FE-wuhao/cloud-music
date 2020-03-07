import React, { useRef, useEffect, memo } from 'react';
import Scroll from '../scroll/index'
import { PropTypes } from 'prop-types';
import {List,ListItem} from './style'

/*这个横向列表的难点主要不在于样式，而在于点击后触发的事件，要清空相关数据并重新获取 */

function Horizen (props) {
  /*
  list:接受的列表数据
  oldVal:当前的 item 值
  title: 列表左边的标题
   */
    const { list, oldVal, title } = props;
    const { handleClick } = props;
    //ref指向列表外围包裹的div元素
    const Category = useRef (null);

    // 加入初始化内容宽度的逻辑
    useEffect (() => {
    let categoryDOM = Category.current;
    //获取div下所有的sapn
    let tagElems = categoryDOM.querySelectorAll ("span");
    let totalWidth = 0;
    //array.from用以将类数组数据转化为真正的数组
    Array.from (tagElems).forEach (ele => {
      //算出所有的分类类型拼接出来的总长度
        totalWidth += ele.offsetWidth;//offsetWidth为元素盒模型的宽度
    });
    //设置分类滚动栏的长度为刚算出的总长度
    categoryDOM.style.width = `${totalWidth}px`;  
    }, []);

    return ( 
        <Scroll direction={"horizental"}>
          <div ref={Category}>
            <List>
              <span>{title}</span>
              {
                list.map ((item) => {
                  return (
                    <ListItem 
                      key={item.key}
                      className={`${oldVal === item.key ? 'selected': ''}`} 
                      onClick={() => handleClick (item.key)}>
                        {item.name}
                    </ListItem>
                  )
                })
              }
            </List>
          </div>
        </Scroll>
      );
}

Horizen.defaultProps = {
  list: [],//接受的列表数据
  oldVal: '',//当前的 item 值
  title: '',//列表左边的标题
  handleClick: null//点击不同的 item 执行的方法
};

Horizen.propTypes = {
  list: PropTypes.array,
  oldVal: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func
};
export default memo (Horizen);