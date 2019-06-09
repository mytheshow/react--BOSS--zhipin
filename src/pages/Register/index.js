import React from 'react';
import Logo from '../../components/Logo';
import {NavBar, WingBlank, List, InputItem, WhiteSpace, Radio, Button, NoticeBar} from 'antd-mobile';
import connect from "react-redux/es/connect/connect";
import {userRegister} from "../../store/actions";
import {Redirect} from 'react-router-dom';

class Register extends React.Component{
    state = {
        username: '',
        password: '',
        password2: '',
        type: 'dashen'  // dashen/laoban
    };

    // 处理输入发生改变的监听回调
    handleChange = (name, value) => {
        this.setState({
            [name]: value
        })
    };

    // 注册的回调
    register = (e) => {
        this.props.userRegister({...this.state});
    };

    goLogin = () => {
        // 编程式路由导航(跳转)
        this.props.history.replace('/login')
    };

    render() {
        if(this.props.redirectTo) {
            return <Redirect to={this.props.redirectTo}/>
        }
        const {type} = this.state;

        return <div>
            <WingBlank>
            <NavBar>仿BOSS直聘</NavBar>
            <Logo/>
                {this.props.msg ? <NoticeBar>提示信息：{this.props.msg}</NoticeBar>:null}
            <InputItem  onChange={val=> this.handleChange('username', val)} placeholder='请输入用户名'>用户名:</InputItem>
            <WhiteSpace/>
            <InputItem   onChange={val=> this.handleChange('password', val)} type='password' placeholder='请输入密码'>密码:</InputItem>
            <WhiteSpace/>
            <InputItem  onChange={val=> this.handleChange('password2', val)} type='password' placeholder='请输入确认密码'>确认密码: </InputItem>
            <WhiteSpace/>
            <List>
                <List.Item>
                    <span>用户类型: </span>&nbsp;&nbsp;&nbsp;
                    <Radio checked={type==='laoban'} onChange={() => this.handleChange('type', 'laoban')}>老板</Radio>&nbsp;&nbsp;&nbsp;
                    <Radio checked={type==='dashen'} onChange={() => this.handleChange('type', 'dashen')}>大神</Radio>
                </List.Item>
            </List>
            <WhiteSpace/>
            <Button onClick={this.register} type='primary'>注&nbsp;&nbsp;册</Button>
            <WhiteSpace/>
            <Button onClick={this.goLogin}>已有账户</Button>
            </WingBlank>
        </div>
    }

}

export default connect(state=>({...state.user}),{userRegister})(Register);