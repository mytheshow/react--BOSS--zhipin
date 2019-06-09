import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TabBar} from 'antd-mobile';
import {withRouter} from 'react-router-dom';

const Item = TabBar.Item;

class NavFooter extends Component {
  //调用该组件必须传递的属性
  static propTypes = {
    navList: PropTypes.array.isRequired,
    unReadCount:PropTypes.number.isRequired
  };

  render () {
    //hide为true的过滤掉(false是过滤)
    const navList = this.props.navList.filter(nav => !nav.hide);
    const unReadCount = this.props.unReadCount;
    // 得到当前请求的路由路径
    const path = this.props.location.pathname;

    return (
      <TabBar>
        {
          navList.map((nav, index) => (
            <Item key={index}
                  badge={nav.path==='/message'?unReadCount:0}
                  icon={{uri: require(`./images/${nav.icon}.png`)}}
                  selectedIcon={{uri: require(`./images/${nav.icon}-selected.png`)}}
                  selected={path===nav.path}
                  onPress={() => this.props.history.replace(nav.path)}
                  title={nav.text}
            />
          ))
        }
      </TabBar>
    )
  }
}

export default withRouter(NavFooter)// 向NavFooter组件传递路由相关属性: history/location/match