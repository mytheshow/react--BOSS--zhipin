import React from 'react';
import {NavBar, WingBlank, InputItem, WhiteSpace, Button ,NoticeBar} from 'antd-mobile';
import Logo from '../../components/Logo';
import {connect} from 'react-redux';
import {userLogin} from '../../store/actions';
import {Redirect} from 'react-router-dom';

class Login extends React.Component{


    state = {
            username: '',
            password: '',
        };
    // 处理输入框/单选框变化, 收集数据到 state
    handleChange = (name, value) => {
        this.setState({[name]: value})
    };
    // 跳转到注册路由
    toRegister = () => {
        this.props.history.replace('/register')
    };
    login = () => {
        this.props.userLogin(this.state.username,this.state.password);
    };
    render() {
        if(this.props.redirectTo) {
            return <Redirect to={this.props.redirectTo}/>
        }
        return <div>
            <WingBlank>
                <NavBar>仿BOSS直聘</NavBar>
                <Logo/>
                {this.props.msg ? <NoticeBar>提示信息：{this.props.msg}</NoticeBar> : null}
                <InputItem  onChange={val=> this.handleChange('username', val)} placeholder='请输入用户名'>用户名:</InputItem>
                <WhiteSpace/>
                <InputItem   onChange={val=> this.handleChange('password', val)} type='password' placeholder='请输入密码'>密码:</InputItem>
                <WhiteSpace/>
                <Button onClick={this.login} type='primary'>登&nbsp;&nbsp;陆</Button>
                <WhiteSpace/>
                <Button onClick={this.toRegister}>去注册</Button>
            </WingBlank>
        </div>
    }

}

export default connect(state=>({...state.user}),{userLogin})(Login);