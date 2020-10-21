import Home from '../App';  //app.js为主页面

import MainPage from '../Components/mainpage/MainPage'; //二级路由页面
import Itinary from '../Components/Itinary';
import CityDetails from '../Components/CityPage/CityDetails';
import Recommondation from '../Components/Recommendation';
import Login from '../Components/loginPage/Login';

export const routes = [
    {
        path: '/home',   //App.js 一级路由
        component: Home
    }
]

export const sebRoutes=[
    {
        path: '/home/MainPage', // 二级路由
        component: MainPage
    },
    {
        path: '/home/Itinary',
        component: Itinary
    },
    {
        path: '/home/CityDetails',
        component: CityDetails
    },
    {
        path: '/home/Recommondation',
        component: Recommondation
    },
    {
        path: '/home/Login',
        component: Login
    }
]