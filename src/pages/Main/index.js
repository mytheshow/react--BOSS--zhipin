import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {NavBar} from 'antd-mobile';
import LaobanInfo from '../LaobanInfo';
import DashenInfo from '../DashenInfo';
import Personal from '../Personal';
import Dashen from '../Dashen';
import Laoban from '../Laoban';
import Message from '../Message';
import Chat from '../Chat';
import Cookies from 'js-cookie';
import {connect} from 'react-redux';
import {getUser} from '../../store/actions';
import {getRedirectPath} from '../../utils';
import NavFooter from '../../components/Nav-footer';

class Main extends React.Component{

    //列表，消息，个人中心的header和footer
    navList = [
        {
            path: '/laoban', // 路由路径
            title: '大神列表',
            icon: 'dashen',
            text: '大神',
        },
        {
            path: '/dashen', // 路由路径
            title: '老板列表',
            icon: 'laoban',
            text: '老板',
        },
        {
            path: '/message', // 路由路径
            title: '消息列表',
            icon: 'message',
            text: '消息',
        },
        {
            path: '/personal', // 路由路径
            title: '用户中心',
            icon: 'personal',
            text: '个人',
        }
    ];

    componentDidMount () {
        // 发ajax请求获取user信息
        // 得到cookie中的userid
        const userid = Cookies.get('userid');
        // redux中的user对象中没有_id
        if(userid && !this.props._id) {
            this.props.getUser()
        }
    }

    render() {
        // 1. 判断cookie中是否有userid, 如果没有, 自动跳转到登陆界面
        const userid = Cookies.get('userid');
        if(!userid) {
            return <Redirect to='/login'/>
        }

        // 2. cookie中有userid(登陆过), 看redux中的user有没有信息, 如果没有(还没有登陆), 发异步请求获取user信息并保存到redux
        if(!this.props._id) {
            // 不能在render()中发ajax请求
            return <div>LOADING...</div>  // 显示一个提示正在请求中的界面
        }

        // 3. 如果redux的user中已经有信息(已经登陆), 如果请求的是应用根路径, 自动跳转到对应的主界面
        // 当前请求的path
        const path = this.props.location.pathname;

        if(path==='/') {
            return <Redirect to={getRedirectPath(this.props.type, this.props.header)}/>
        }

        const navList = this.navList;
        // 得到当前nav对象
        const currentNav = navList.find(nav => path===nav.path);

        // 动态确定哪个nav需要隐藏
        if(this.props.type==='laoban') {
            navList[1].hide = true
        } else {
            navList[0].hide = true
        }
        return <div>
            {currentNav ? <NavBar className='header-fixed' >{currentNav.title}</NavBar> : null}
            <Switch>
                <Route path='/laobaninfo' component={LaobanInfo}/>
                <Route path='/dasheninfo' component={DashenInfo}/>
                <Route path='/laoban' component={Laoban}/>
                <Route path='/dashen' component={Dashen}/>
                <Route path='/message' component={Message}/>
                <Route path='/personal' component={Personal}/>
                <Route path='/chat/:userid' component={Chat} />
            </Switch>
            {currentNav ? <NavFooter navList={this.navList} unReadCount={this.props.unReadCount} /> : null}
        </div>
    }

}

export default connect(state=>({...state.user, unReadCount:state.chat.unReadCount}),{getUser})(Main);