import React, {useRef, useState, useEffect, useMemo} from 'react';
import { debounce } from './../../api/utils';//防抖函数
import {SearchBoxWrapper} from './style'
/*这个父元素query和子元素query、newquerey整这么半天是为了‘双向绑定’
父元素点击下半区标签，引发父query变化，从而引起子newquery变化，从而再引起子query变化，从而输入框中value与父query同步
子元素输入框输入内容，子query变化，引起父元素回调函数执行，父元素query同步变化
那么问题来了  搞这么复杂的逻辑有必要吗 绕晕了 ref转发不行吗？？？后期验证▲▲▲▲▲
*/

const SearchBox = (props) => {
  const queryRef = useRef();
  const [query, setQuery] = useState('');//搜索框中显示的内容

  const { newQuery } = props;//搜索框中输入的内容 
  const { handleQuery } = props;

  const displayStyle = query ? {display: 'block'}: {display: 'none'};

  const handleChange = (e) => {//搜索处理函数
    setQuery(e.currentTarget.value);
  };
  const clearQuery = () => {
    setQuery('');
    queryRef.current.focus();
  }

  let handleQueryDebounce = useMemo(() => {
    return debounce(handleQuery, 500);
  }, [handleQuery]);

  //初始化函数
  useEffect(() => {
    queryRef.current.focus();//在初始化阶段让搜索框的光标被选中
  }, []);
  //一旦搜索内容发生变化时的执行函数 
  useEffect(() => {
    handleQueryDebounce(query);
    // eslint-disable-next-line 
  }, [query]);
  useEffect(() => {
    if(newQuery !== query){
      setQuery(newQuery);
    }
    // eslint-disable-next-line
  }, [newQuery]);

  return (
    <SearchBoxWrapper>
      {/*返回按钮 */}
      <i className="iconfont icon-back" onClick={() => props.back()}>&#xe655;</i>
      {/*搜索内容输入框 */}
      <input ref={queryRef} className="box" placeholder="搜索歌曲、歌手、专辑" value={query} onChange={handleChange}/>
      {/*清除搜索内容按钮 */}
      <i className="iconfont icon-delete" onClick={clearQuery} style={displayStyle}>&#xe600;</i>
    </SearchBoxWrapper>
  )
};

export default React.memo(SearchBox);