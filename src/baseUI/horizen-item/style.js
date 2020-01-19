import styled from'styled-components';
import style from '../../assets/global-style';

export const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
  /* 子元素中第一层中的span中的第一个 */
  >span:first-of-type {
    display: block;
    /*不放大也不缩小，保留项目的原本长度 */
    flex: 0 0 auto;
    padding: 5px 0;
    margin-right: 5px;
    color: grey;
    font-size: ${style["font-size-m"]};
    /* vertical-align: middle; */
  }
`
export const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style["font-size-m"]};
  padding: 5px 8px;/*设置items之间的间距 */
  border-radius: 10px;
  &.selected {
    color: ${style["theme-color"]};
    border: 1px solid ${style["theme-color"]};
    opacity: 0.8;
  }
`