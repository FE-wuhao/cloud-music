import React from 'react';
import { 
  ListWrapper,
  ListItem,
  List
} from './style';
import { getCount } from "../../api/utils";
import LazyLoad from "react-lazyload";
import { withRouter } from 'react-router-dom';

/* ListWrapper：整个推荐列表部分的大容器
    h1：推荐歌单列表的标题
    List：所有推荐列表的容器，进行flex布局
    ListItem：所有列表内容，为一个个小方格

    注：上均使用纯粹的css进行flex布局
*/

/* react-lazyload使用方法：
    1.在图片的外面包裹一层LazyLoad，
      并设置placeholder属性为要懒加载时显示的内容（可以是图片或者其他）
    2.向scroll的onscroll属性传入执行函数，
      当滑动的时候执行该函数，即传入forcecheck函数，
      作用是解除懒加载状态显示图片，实现手段是。。。有待考证！
*/
function RecommendList (props) {
  const enterDetail = (id) => {
    props.history.push (`/recommend/${id}`)//路由跳转  渲染album页面
  }

  return (
    <ListWrapper>
      <h1 className="title"> 推荐歌单 </h1>
      <List>
        {
          //此处的推荐列表资源竟然没有提前解构出来，不够规范，值得改进
          props.recommendList.map ((item, index) => {
            return (
              <ListItem key={item.id + index} onClick={() => enterDetail (item.id)}>{/*点击具体歌单时根据歌单Id发出请求请求歌单数据  并进行路由跳转 渲染album页面 */}
                <div className="img_wrapper">
                  <div className="decorate"></div>
                  <LazyLoad placeholder={<img width="100%" height="100%" src={require ('./music.png')} alt="music"/>}>
                    {/* 加此参数可以减小请求的图片资源大小 */}
                    <img src={item.picUrl + "?param=300x300"} width="100%" height="100%" alt="music"/>
                  </LazyLoad>
                  <div className="play_count">
                    <i className="iconfont play">&#xe885;</i>
                    {/*getcount的目的是将获取到的播放数数据格式化为想要展现的格式 */}
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
 
export default React.memo (withRouter (RecommendList));

