import styled from'styled-components';
import style from '../../assets/global-style';

// Props 中的 globalRank 和 tracks.length 均代表是否为全球榜

export const Container = styled.div`
  position: fixed;
  top: 90px;
  bottom: 0;
  width: 100%;
  .offical,.global {
    margin: 10px 5px;
    padding-top: 15px;
    font-weight: 700;
    font-size: ${style["font-size-m"]};
    color: ${style["font-color-desc"]};
  }
`;
export const List = styled.ul`
  margin-top: 10px;
  padding: 0 5px;
  display: ${props => props.globalRank ? "flex": "" };
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  background: ${style["background-color"]};
  /* 这又是个什么原理  list整体后面加一个占位的框？为什么就起到了不居中的作用呢？？？？？？？？ */
  /* ：：after生成的元素插入在List的最后面话又说回来  如果排行榜满了三个那岂不是最下面一行是一块空白？？ */
  /* 解答：因为他没有高度 所以就算多出一行也没事  等于没有 */
  &::after {
    content:"";
    display:block;
    width: 32vw;
  }
  
`
export const ListItem = styled.li`
  display: ${props => props.tracks.length ? "flex": ""};
  padding: 3px 0;
  border-bottom: 1px solid ${style["border-color"]};
  .img_wrapper {
    width:  ${props => props.tracks.length ? "27vw": "32vw"};
    height: ${props => props.tracks.length ? "27vw": "32vw"};
    border-radius: 3px;
    position: relative;
    .decorate {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient (hsla (0,0%,100%,0),hsla (0,0%,43%,.4));
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
    .update_frequecy {
      position: absolute;
      left: 7px;
      bottom: 7px;
      font-size: ${style["font-size-ss"]};
      color: ${style["font-color-light"]};
    }
  }
`;
export const SongList = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  /* 使得内容比border小一些，整体小于榜单名块的大小 */
  padding: 10px 10px;
  >li {
    font-size: ${style["font-size-s"]};
    color: grey;
  }
`;

export const EnterLoading = styled.div`
  position: fixed;
  left: 0; right: 0; top: 0; bottom: 0;
  width: 100px;
  height: 100px;
  margin: auto;
`