import React from 'react';
import {LoadingWrapper} from './style'
import { PropTypes } from 'prop-types';

function Loading (props)  {
  const {show} = props;

  return (
    <LoadingWrapper style={show ? {display: ""}: {display: "none"}}>
      <div></div>
      <div></div>
    </LoadingWrapper>
  );
}
 
Loading.defaultProps = {
  show: true
};

Loading.propTypes = {
  show: PropTypes.bool
};

export default React.memo (Loading);