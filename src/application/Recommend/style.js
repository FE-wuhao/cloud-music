import styled from'styled-components';
//这里还要去深究一下他没有设置高度，那么他的高度怎么算的▲
//2020/3/9 9:08 答：设置了top和bottom  name只要父元素有高度他就有高度了
//反引号允许保留多行字符串的格式
export const Content = styled.div`
  position: fixed;
  top: 90px;
  bottom: ${props => props.play > 0?"60px": 0};
  width: 100%;
`