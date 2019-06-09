import React, {Component} from 'react';
/*
老板的主界面路由组件
 */
import {connect} from 'react-redux';
import {getUserList} from '../../store/actions';

import UserList from '../../components/user-list';
class Laoban extends Component {

    componentDidMount () {
        // 发请求异步从后台获取userList到redux的userList状态
        this.props.getUserList('dashen')
    }

    render () {

        return (
            <UserList userList={this.props.userList}/>
        )
    }
}

export default connect(state => ({userList: state.userList}), {getUserList})(Laoban)