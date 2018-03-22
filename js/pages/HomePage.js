/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Navigator,
    Image,
    View,
    DeviceEventEmitter
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import PopularPage from './PopularPage'
import TrendingPage from './TrendingPage'
import FavoritePage from './FavoritePage'
import MyPage from './my/MyPage'
import Toast,{DURATION} from 'react-native-easy-toast'
export const ACTION_HOME={A_SHOW_TOAST:'showToast',A_RESTART:'restart'};
export const FLAG_TAB={
    flag_popularTab:'tb_popular',
    flag_trendingTab:'tb_trending',
    flag_favoriteTab:'tb_favorite',
    flag_my:'tb_my'
}
export default class HomePage extends Component {
    constructor(props) {
        super(props);
        let selectedTab=this.props.selectedTab?this.props.selectedTab:'tb_popular';
        this.state = {
            selectedTab: selectedTab,
            theme:this.props.theme
        }
    }
    componentDidMount(){
        // 通知监听
        this.listener = DeviceEventEmitter.addListener('ACTION_HOME',(action,params) => this.onAction(action,params));
    }

    /**
     * 通知回调事件处理
     * @param action
     * @param params
     */
    onAction(action,params){
        if(ACTION_HOME.A_RESTART===action){
            this.onRestart(params)
        }else if(ACTION_HOME.A_SHOW_TOAST===action){
            this.toast.show(params.text,DURATION.LENGTH_LONG);
        }
    }
    componentWillUnmount(){
        if (this.listener) {
            this.listener.remove();
        }
    }

    /**
     * 重启首页
     * @param jumpToTab 默认显示的页面
     */
    onRestart(jumpToTab){
        this.props.navigator.resetTo({
            component:HomePage,
            params:{
                ...this.props,
                selectedTab:jumpToTab
            }
        })
    }
    _renderTab(Component, selectedTab, title, renderIcon) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                selectedTitleStyle={this.props.theme.styles.selectedTitleStyle}
                title={title}
                renderIcon={() => <Image style={styles.image}
                                         source={renderIcon}/>}
                renderSelectedIcon={() =><Image style={[styles.image, this.state.theme.styles.tabBarSelectedIcon]}
                                                source={renderIcon}/>}
                onPress={() => this.setState({selectedTab: selectedTab})}>
                <Component {...this.props}/>
            </TabNavigator.Item>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    {this._renderTab(PopularPage,'tb_popular','最热',require('../../res/images/ic_polular.png'))}
                    {this._renderTab(TrendingPage,'tb_trending','趋势',require('../../res/images/ic_trending.png'))}
                    {this._renderTab(FavoritePage,'tb_favorite','收藏',require('../../res/images/ic_favorite.png'))}
                    {this._renderTab(MyPage,'tb_my','我的',require('../../res/images/ic_my.png'))}
                </TabNavigator>
                <Toast ref={(toast)=>this.toast=toast}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        height: 26,
        width: 26,
    }
});

