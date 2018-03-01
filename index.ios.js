/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    Platform,
    StyleSheet,
    Navigator,
    Image,
    Text,
    View,
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';

import Boy from './Boy'
import ListViewTest from './ListViewTest'

export default class RNAPPGithub extends Component {
    constructor(props){
        super(props);
        this.state={
            selectedTab:'tb_popular',
        }
    }

    render() {
        return (
            <View style={styles.container}>
            {/*<TabNavigator>*/}
                {/*<TabNavigator.Item*/}
                    {/*selected={this.state.selectedTab === 'tb_popular'}*/}
                    {/*selectedTitleStyle={{color:'red'}}*/}
                    {/*title="最热"*/}
                    {/*renderIcon={() => <Image style={styles.image} source={require('./res/images/ic_polular.png')} />}*/}
                    {/*renderSelectedIcon={() => <Image style={[styles.image,{tintColor:'red'}]} source={require('./res/images/ic_polular.png')} />}*/}
                    {/*badgeText="1"*/}
                    {/*onPress={() => this.setState({ selectedTab: 'tb_popular' })}>*/}
                    {/*<View style={styles.page1}></View>*/}
                {/*</TabNavigator.Item>*/}
                {/*<TabNavigator.Item*/}
                    {/*selected={this.state.selectedTab === 'tb_trending'}*/}
                    {/*title="趋势"*/}
                    {/*renderIcon={() => <Image style={styles.image} source={require('./res/images/ic_trending.png')} />}*/}
                    {/*renderSelectedIcon={() => <Image style={[styles.image,{tintColor:'yellow'}]} source={require('./res/images/ic_trending.png')} />}*/}
                    {/*onPress={() => this.setState({ selectedTab: 'tb_trending' })}>*/}
                    {/*<View style={styles.page2}></View>*/}
                {/*</TabNavigator.Item>*/}
                {/*<TabNavigator.Item*/}
                    {/*selected={this.state.selectedTab === 'tb_favorite'}*/}
                    {/*selectedTitleStyle={{color:'red'}}*/}
                    {/*title="收藏"*/}
                    {/*renderIcon={() => <Image style={styles.image} source={require('./res/images/ic_polular.png')} />}*/}
                    {/*renderSelectedIcon={() => <Image style={[styles.image,{tintColor:'red'}]} source={require('./res/images/ic_polular.png')} />}*/}
                    {/*badgeText="1"*/}
                    {/*onPress={() => this.setState({ selectedTab: 'tb_favorite' })}>*/}
                    {/*<View style={styles.page1}></View>*/}
                {/*</TabNavigator.Item>*/}
                {/*<TabNavigator.Item*/}
                    {/*selected={this.state.selectedTab === 'tb_my'}*/}
                    {/*title="我的"*/}
                    {/*renderIcon={() => <Image style={styles.image} source={require('./res/images/ic_trending.png')} />}*/}
                    {/*renderSelectedIcon={() => <Image style={[styles.image,{tintColor:'yellow'}]} source={require('./res/images/ic_trending.png')} />}*/}
                    {/*onPress={() => this.setState({ selectedTab: 'tb_my' })}>*/}
                    {/*<View style={styles.page2}></View>*/}
                {/*</TabNavigator.Item>*/}
            {/*</TabNavigator>*/}

                {/*<Navigator*/}
                    {/*initialRoute={{*/}
                        {/*component: Boy*/}
                    {/*}}*/}
                    {/*renderScene={(route, navigator)=>{*/}
                        {/*let Component=route.component;*/}
                        {/*return <Component navigator={navigator} {...route.params}/>*/}
                    {/*}}*/}
                {/*></Navigator>*/}

                <ListViewTest/>
            </View>

        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
    },
    page1:{
        flex:1,
        backgroundColor:'red',
    },
    page2:{
        flex:1,
        backgroundColor: 'green',
    },
    image:{
        height:22,
        width:22,
    }
});

AppRegistry.registerComponent('RNAPPGithub', () => RNAPPGithub);
