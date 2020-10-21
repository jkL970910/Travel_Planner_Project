import React from 'react';
import './App.css';
import { sebRoutes } from "./router"
import { Route, Redirect } from "react-router-dom"
import Admin from "./Components/admin/Admin"



function App() {
    return (
      <div className="App">
        <Admin>    {/*主页面布局*/}
          {
            /*渲染二级路由*/
            sebRoutes.map((item) => {
              return <Route key={item.path} path={item.path} component={item.component} />
            })
          }
          <Redirect from="/home" to="/home/MainPage" exact />
        </Admin>
      </div>
      );
  }
export default App;