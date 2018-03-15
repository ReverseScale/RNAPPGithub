/**
 * SearchPage
 * @flow
 * **/

'use strict';
import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Image,
    Platform,
    TextInput,
    TouchableOpacity,
    Text,
} from "react-native";

import {FLAG_TAB} from './HomePage'
import ViewUtils from '../util/ViewUtils'
import GlobalStyles from '../../res/styles/GlobalStyles'
export default class SearchPage extends Component {
    constructor(props){
        super(props);
        this.inputKey='';
        this.state={
            rightButtonText:'搜索'
        }
    }
    onRightButtonClick() {
        if (this.state.rightButtonText === '搜索') {
            this.updateState({rightButtonText: '取消'});
            this.loadData();
        } else {
            this.updateState({
                rightButtonText: '搜索',
                isLoading: false,
            });
        }
    }
    onBackPress(e){
        this.refs.input.blur();
        this.props.navigator.pop();
        return true;
    }
    loadData() {
    }
    updateState(dic) {
        if (!this)return;
        this.setState(dic);
    }

    renderNavBar() {
        let backButton =ViewUtils.getLeftButton(()=>this.onBackPress());

        let inputView =
            <TextInput
                ref="input"
                style={styles.textInput}
                autoFocus={true}
                underlineColorAndroid="white"
                placeholder="搜索"
                placeholderTextColor="white"
                clearTextOnFocus={true}
                clearButtonMode="while-editing"
                onChangeText={inputKey=>this.inputKey=inputKey}
            />;
        let rightButton =
            <TouchableOpacity
                onPress={()=> {
                    this.refs.input.blur();
                    this.onRightButtonClick();
                }}
            >
                <View style={{alignItems: 'center', marginRight: 10}}>
                    <Text style={styles.title}>{this.state.rightButtonText}</Text>
                </View>
            </TouchableOpacity>;
        return (
            <View style={{
                backgroundColor: '#2196F3',
                height: Platform.OS==='ios'? GlobalStyles.nav_bar_height_ios:GlobalStyles.nav_bar_height_android,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                {backButton}
                {inputView}
                {rightButton}
            </View>
        )
    }

    render() {
        let statusBar = null;

        if (Platform.OS === 'ios') {
            statusBar =
                <View style={[styles.statusBar, {backgroundColor: '#2196F3'}]}/>;
        }
        return (
            <View style={[GlobalStyles.root_container,]}>
                {statusBar}
                {this.renderNavBar()}
            </View>
        )
    }

}
const styles = StyleSheet.create({
    statusBar: {
        height: 20,
    },
    title: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    textInput: {
        flex: 1,
        height: (Platform.OS === 'ios') ? 30 : 40,
        borderWidth: 1,
        borderColor: 'white',
        alignSelf: 'center',
        paddingLeft: 5,
        marginLeft: 5,
        marginRight: 10,
        borderRadius: 3,
        opacity: 0.7,
        color: 'white'
    }
})