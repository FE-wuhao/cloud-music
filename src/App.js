import React from 'react';
import { GlobalStyle } from  './style';
import {IconStyle} from './assets/iconfont/iconfont';
import routes from './routes/index.js';
import { renderRoutes } from 'react-router-config';
import { HashRouter } from 'react-router-dom';

export function App(){
    return(
        <HashRouter>
            <GlobalStyle />
            <IconStyle />
            {renderRoutes(routes)}
        </HashRouter>
    );
}