/*
包含n个接口请求函数的模块
函数的返回值为: promise
 */
import ajax from './ajax'

const BASE = 'http://localhost:3001';
//const BASE = '';

// 请求注册接口
export const reqRegister = ({username, password, type}) => ajax(BASE+'/register', {username, password, type}, 'POST');

// 请求登陆接口
export const reqLogin = (username, password) => ajax(BASE+'/login', {username, password}, 'POST');

// 请求更新用户接口
export const reqUpdateUser = (user) => ajax(BASE+'/update', user, 'POST');

// 请求获取当前用户
export const reqUser = () => ajax(BASE + '/user');

// 请求获取指定类型的用户列表
export const reqUserList = (type) => ajax(BASE+'/userlist', {type});

// 请求获取当前用户的所有聊天记录
export const reqChatMsgList = () => ajax(BASE+'/msglist');
// 标识查看了指定用户发送的聊天信息
export const reqReadChatMsg = (from) => ajax(BASE+'/readmsg', {from}, 'POST');