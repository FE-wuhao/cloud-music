import React from 'react';
import { 
  ListWrapper,
  ListItem,
  List
} from './style';
import { getCount } from "../../api/utils";
import LazyLoad from "react-lazyload";


function RecommendList (props) {
  return (
    <ListWrapper>
      <h1 className="title"> 推荐歌单 </h1>
      <List>
        {
          props.recommendList.map ((item, index) => {
            return (
              <ListItem key={item.id + index}>
                <div className="img_wrapper">
                  <div className="decorate"></div>
                  {/* react-lazyload使用方法：
                      1.在图片的外面包裹一层LazyLoad，
                        并设置placeholder属性为要懒加载时显示的内容（可以是图片或者其他）
                      2.向scroll的onscroll属性传入执行函数，
                        当滑动的时候执行该函数，即出入forcecheck函数，
                        作用是解除懒加载状态显示图片，实现手段是。。。有待考证！
                  */}
                    <LazyLoad placeholder={<img width="100%" height="100%" src={require ('./music.png')} alt="music"/>}>
                      <img src={item.picUrl + "?param=300x300"} width="100%" height="100%" alt="music"/>
                    </LazyLoad>
                  <div className="play_count">
                    <i className="iconfont play">&#xe885;</i>
                    <span className="count">{getCount (item.playCount)}</span>
                  </div>
                </div>
                <div className="desc">{item.name}</div>
              </ListItem>
            )
          })
        }
      </List>
    </ListWrapper>
  );
  }
 
export default React.memo (RecommendList);

