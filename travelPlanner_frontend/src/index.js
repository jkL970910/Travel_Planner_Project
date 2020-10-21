import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { routes } from "./router"  //第一级路由数组
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

ReactDOM.render(
  <Router>
    <Switch>
        {
          // 一级路由
          routes.map((item) => {
            return <Route key={item.path} path={item.path} component={item.component}></Route>
          })
        }
        <Redirect from="/" to="/home" exact></Redirect> 
    </Switch>
  </Router>
  //<React.StrictMode>
    //<App />
  //</React.StrictMode>,
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
