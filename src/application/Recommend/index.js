import React from 'react';

function Recommend(props) {
  return  (
  <div>{props.location.pathname}</div>
  )
}

export default React.memo(Recommend);