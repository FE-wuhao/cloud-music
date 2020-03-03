import React, {useRef, useState, useEffect, useMemo} from 'react';
import { debounce } from './../../api/utils';//防抖函数
import {SearchBoxWrapper} from './style'

const SearchBox = (props) => {
  const queryRef = useRef();
  const [query, setQuery] = useState('');

  const { newQuery } = props;
  const { handleQuery } = props;

  const displayStyle = query ? {display: 'block'}: {display: 'none'};

  const handleChange = (e) => {
    setQuery(e.currentTarget.value);
  };
  const clearQuery = () => {
    setQuery('');
    queryRef.current.focus();
  }

  let handleQueryDebounce = useMemo(() => {
    return debounce(handleQuery, 500);
  }, [handleQuery]);

  useEffect(() => {
    queryRef.current.focus();
  }, []);
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