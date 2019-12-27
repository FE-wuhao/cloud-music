import React from 'react';
import { renderRoutes } from 'react-router-config';

function Home (props) {
  return (
    <div>Home</div>
    // {renderRoutes(routes)}
  )
}

export default React.memo (Home);