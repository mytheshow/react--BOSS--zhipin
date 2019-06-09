/*
大神信息完善路由组件
 */
import React from 'react';
import {NavBar, InputItem, TextareaItem, Button} from 'antd-mobile';
import  HeaderSelector from '../../components/Header-selector';
import {connect} from 'react-redux';
import {updateUser} from '../../store/actions';
import {Redirect} from 'react-router-dom';

class DashenInfo extends React.Component{
    state = {
        header: '',
        info: '',
        position: ''
    };
    setHeader = (header) => {
        this.setState({
            header
        })
    };
    handleChange = (name, value) => {
        this.setState({
            [name]: value
        })
    };
    save = () => {
        // 分发异步action更新后台用户信息同时更新redux中的user状态
        this.props.updateUser(this.state)
        //console.log(this.state);
    };
    render() {
        // 如果用户信息已完善, 自动跳转到大神主界面
        if (this.props.header) {
            return <Redirect to='/dashen'/>
        }
        return (
            <div>
                <NavBar>大神信息完善</NavBar>
                <HeaderSelector setHeader={this.setHeader} />
                <InputItem onChange={val => this.handleChange('position', val)} >求职岗位:</InputItem>
                <TextareaItem title="个人介绍:" rows={3} onChange={val => this.handleChange('info', val)}/>
                <Button type='primary' onClick={this.save} >保存</Button>
            </div>
        )
    }
}

export default connect(state => ({...state.user}), {updateUser})(DashenInfo)