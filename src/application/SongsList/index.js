import React from 'react';
import { SongList, SongItem } from "./style";
import { getName } from '../../api/utils';

const SongsList = React.forwardRef ((props, refs)=> {

  const { 
    collectCount, //收藏人数
    showCollect, //是否显示收藏数
    songs//歌曲资源
   } = props;

  const totalCount = songs.length;//所有歌曲的数量

  //曲目被点击时的执行函数
  const selectItem = (e, index) => {
    console.log (index);
  }

  let songList = (list) => {
    let res = [];//用来保存整个列表的html的变量
    //拆分歌单列表，对每一首歌单独处理
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      res.push (
        <li key={item.id} onClick={(e) => selectItem (e, i)}>
          <span className="index">{i + 1}</span>{/*最左侧序号 */}
          <div className="info">
            {/*
              item.name：歌名
              item.ar/item.artists：歌手们
              item.al.name/item.album.name：专辑名称
            */}
            <span>{item.name}</span>{/* 歌名 */}
            <span>
              { item.ar ? getName (item.ar): getName (item.artists) } - { item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      )
    }
    return res;
  };

  const collect = (count) => {
    return  (
      <div className="add_list">
        <i className="iconfont">&#xe62d;</i>
        <span > 收藏 ({Math.floor (count/1000)/10} 万)</span>
      </div>
    )
  };
  return (
    <SongList ref={refs} showBackground={props.showBackground}>
      <div className="first_line">
        <div className="play_all" onClick={(e) => selectItem (e, 0)}>
          <i className="iconfont">&#xe6e3;</i>
          <span > 播放全部 <span className="sum">(共 {totalCount} 首)</span></span>
        </div>
        { showCollect ? collect (collectCount) : null}{/*显示收藏数量  歌手是没有收藏数量的  说明这里在copy  很不走心*/}
      </div>
      <SongItem>
        {/*之前不都是一直map用得好好的吗  这里怎么不用了。。。 */}
        { songList (songs) }{/*songList (songs)执行出来的结果是一个完整的列表结构 */}
      </SongItem>
    </SongList>
  )
});

export default React.memo (SongsList);