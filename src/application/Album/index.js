//歌单页面

import React, {useState, useCallback, useRef} from 'react';
import {Container,TopDesc,SongList,SongItem,Menu} from './style';
import { CSSTransition } from 'react-transition-group';//第三方动画过度库
import  Header  from './../../baseUI/header/index';
import Scroll from '../../baseUI/scroll/index';
import { getName,getCount } from './../../api/utils';
import style from "../../assets/global-style";

export const HEADER_HEIGHT = 45;

function Album (props) {
  const [showStatus, setShowStatus] = useState (true);//开启/关闭动画
  const [title, setTitle] = useState ("歌单");//歌单页面最左上角的标题内容
  const [isMarquee, setIsMarquee] = useState (false);// 是否跑马灯

  const headerEl = useRef ();
  
  //mock 数据
  const currentAlbum = {
    creator: {
      avatarUrl: "http://p1.music.126.net/O9zV6jeawR43pfiK2JaVSw==/109951164232128905.jpg",
      nickname: "浪里推舟"
    },
    coverImgUrl: "http://p2.music.126.net/ecpXnH13-0QWpWQmqlR0gw==/109951164354856816.jpg",
    subscribedCount: 2010711,
    name: "听完就睡，耳机是天黑以后柔软的梦境",
    tracks:[
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
      {
        name: "我真的受伤了",
        ar: [{name: "张学友"}, {name: "周华健"}],
        al: {
          name: "学友 热"
        }
      },
    ]
  }

  const handleBack = () => {
    setShowStatus (false);
  };
//该pos参数是一个实例化好的完整的better-scroll对象
  const handleScroll = (pos) => {
    let minScrollY = -HEADER_HEIGHT;
    let percent = Math.abs (pos.y/minScrollY);
    let headerDom = headerEl.current;//这是一个Header的ref，获取到的Header节点
    // 滑过顶部的高度开始变化
    if (pos.y < minScrollY) {
      headerDom.style.backgroundColor = style["theme-color"];
      headerDom.style.opacity = Math.min (1, (percent-1)/2);
      setTitle (currentAlbum.name);
      setIsMarquee (true);
    } else {
      headerDom.style.backgroundColor = "";
      headerDom.style.opacity = 1;
      setTitle ("歌单");
      setIsMarquee (false);
    }
  };
  
  return (
    <CSSTransition
      in={showStatus}  //根据showStatus的值控制动画的开启与关闭
      timeout={300} //动画执行时长
      classNames="fly" /*作为类名前缀在动画的不同阶段（enter,exits,done）拼接成不同的类名
      如：fly-enter,fly-enter-active,fly-enter-done,fly-exit,fly-exite-active,fly-exit-done, fly-appear
      每一个类名都对应着单独的状态
      */
      appear={true} //渲染的时候就直接执行动画，默认false
      unmountOnExit//为true 代表退出的时候移除dom，也就是该元素dom动画执行完后直接删除该元素节点
      onExited={props.history.goBack}//当组件exit类名被移除时调用props.history.goBack
    >
    {/* 动画展示的旋转平移的具体内容 */}
      <Container>
        {/*对于这里的header和scroll为什么会有重叠抱有疑问  难道是因为不是一个z-index上的？ */}
        {/*scroll相对于container的大小是100%，故产生了重叠 */}
        <Header ref={headerEl} title={title} handleClick={handleBack} isMarquee={isMarquee}></Header>{/*歌单页面最上方的返回箭头和标题 */}
        {/*老规矩  将方法传入scroll组件  在组件内部向方法传参 */}
        <Scroll bounceTop={false} onScroll={handleScroll}>
            <div>
                <TopDesc background={currentAlbum.coverImgUrl}>
                  <div className="background">
                      <div className="filter"></div>
                  </div>
                  <div className="img_wrapper">
                      <div className="decorate"></div>
                      <img src={currentAlbum.coverImgUrl} alt=""/>
                      <div className="play_count">
                      <i className="iconfont play">&#xe885;</i>
                      <span className="count">{Math.floor (currentAlbum.subscribedCount/1000)/10} 万 </span>
                      </div>
                  </div>
                  <div className="desc_wrapper">
                      <div className="title">{currentAlbum.name}</div>
                      <div className="person">
                      <div className="avatar">
                          <img src={currentAlbum.creator.avatarUrl} alt=""/>
                      </div>
                      <div className="name">{currentAlbum.creator.nickname}</div>
                      </div>
                  </div>
                </TopDesc>
                <Menu>
                    <div>
                        <i className="iconfont">&#xe6ad;</i>
                        评论
                    </div>
                    <div>
                        <i className="iconfont">&#xe86f;</i>
                        点赞
                    </div>
                    <div>
                        <i className="iconfont">&#xe62d;</i>
                        收藏
                    </div>
                    <div>
                        <i className="iconfont">&#xe606;</i>
                        更多
                    </div>
                </Menu>
                <SongList>
                    <div className="first_line">
                        <div className="play_all">
                        <i className="iconfont">&#xe6e3;</i>
                        <span > 播放全部 <span className="sum">(共 {currentAlbum.tracks.length} 首)</span></span>
                        </div>
                        <div className="add_list">
                        <i className="iconfont">&#xe62d;</i>
                        <span > 收藏 ({getCount (currentAlbum.subscribedCount)})</span>
                        </div>
                    </div>
                    <SongItem>
                        {
                        currentAlbum.tracks.map ((item, index) => {
                            return (
                            <li key={index}>
                                <span className="index">{index + 1}</span>
                                <div className="info">
                                  {/* 
                                    item.name：歌名
                                    item.ar：歌手们
                                    item.al.name：专辑名称
                                  */}
                                <span>{item.name}</span>
                                <span>
                                    { getName (item.ar) } - { item.al.name }
                                </span>
                                </div>
                            </li>
                            )
                        })
                        }
                    </SongItem>
                </SongList>
            </div>  
        </Scroll>
      </Container>
    </CSSTransition>
  )
}

export default React.memo (Album);