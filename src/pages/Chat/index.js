/*对话聊天的路由组件
*/
import React, {Component} from 'react';
import {NavBar, List, InputItem, Icon,Grid} from 'antd-mobile';
import {connect} from 'react-redux';

import {sendMsg,readMsg} from '../../store/actions';
const Item = List.Item;
class Chat extends Component {
    state = {
        content: '',
        isShow: false // 是否显示表情列表
    };
    submit = () => {
        const content = this.state.content.trim();
        const to = this.props.match.params.userid;
        const from = this.props.user._id;
        if(!content){
            return ;
        }
        this.props.sendMsg({from, to, content});
        this.setState({content: ''})
    };
    componentWillMount () {
        this.emojis = ['😀','😃','😄','😁','😆','😅','🤣','😂','😀','😃','😄','😁','😆','😅','🤣','😂','😀','😃','😄','😁','😆','😅','🤣','😂'];
        this.emojis = this.emojis.map(value => ({text: value}))
    }
    componentDidMount() {
// 初始显示列表,滚动到某个坐标，滚轴的底部为基点，并不是滚上去的内容
        window.scrollTo(0, document.body.scrollHeight)
    }
    componentDidUpdate () {
// 更新显示列表
        window.scrollTo(0, document.body.scrollHeight)
    }

    componentWillUnmount() {
        this.props.readMsg(this.props.match.params.userid)
    }

    // 切换表情列表的显示
    toggleShow = () => {
        const isShow = !this.state.isShow;
        this.setState({isShow});
        if(isShow) {
// 异步手动派发 resize 事件,解决表情列表显示的 bug,这是antd-mobile官方给出的解决方案
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            }, 0)
        }
    };



    render() {
        const {user} = this.props;//获取当前登陆用户
        const {chatMsgs, users} = this.props.chat;//获取正在和某用户聊天内容和所有用户(主要是头像)
        const targetId = this.props.match.params.userid;//获取正在和哪个用户聊天的_id
        //第一次渲染users是空，不再往下执行。如果第二次渲染不是空users[targetId]不存在也不再执行
        if(!users[targetId]) {
            return null
        }
        const meId = user._id;
        const chatId = [targetId, meId].sort().join('-');
        const msgs = chatMsgs.filter(msg => msg.chat_id===chatId);//只获取当前用户和某个目标用户的聊天
        //获取头像
        const targetIcon = users[targetId] ? require(`../../assets/images/${users[targetId].header}.png`) : null;
        return (
            <div id='chat-page'>
                <NavBar className='stick-top' icon={<Icon type='left'/>} onLeftClick={() => this.props.history.goBack()}>
                    {users[targetId].username}
                </NavBar>
                <List style={{marginBottom:50}}>
                    {
                        msgs.map(msg => {if(msg.from===targetId) {
                            return (
                                <Item key={msg._id} thumb={targetIcon}>
                                    {msg.content}
                                </Item>
                            )
                        } else {
                            return (
                                <Item key={msg._id} className='chat-me' extra='我'>
                                    {msg.content}
                                </Item>
                            )
                        }
                        })
                    }
                </List>
                <div className='am-tab-bar'>
                    <InputItem placeholder="请输入" value={this.state.content} onChange={val => this.setState({content: val})} onFocus={() => this.setState({isShow: false})}
                               extra={
                                   <span>
                                    <span onClick={this.toggleShow} style={{marginRight: 10}}>'🤣'</span>
                                    <span onClick={this.submit}>发送</span>
                                   </span>
                               }/>
                    {
                        this.state.isShow ? (
                            <Grid data={this.emojis} columnNum={8} carouselMaxRow={4} isCarousel={true}
                                  onClick={(item) => {
                                      this.setState({content: this.state.content + item.text})
                                  }}
                            />
                        ) : null
                    }
                </div>
            </div>
        )
    }
}
export default connect(state => ({user: state.user, chat: state.chat}), {sendMsg,readMsg})(Chat)