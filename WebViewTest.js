/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    WebView,
    TextInput,
    DeviceEventEmitter
} from 'react-native'
import NavigationBar from './js/common/NavigationBar'
const URL='http://www.imooc.com';
export default class WebViewTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: URL,
            canGoBack:false,
            title:'WebView使用'
        }
    }

    search() {
        this.setState({
            url:this.searchText
        })
    }
    onNavigationStateChange(e){
        this.setState({
            canGoBack: e.canGoBack,
            url: e.url,
            title:e.title
        });
    }
    goBack(){
        if(this.state.canGoBack){
            this.webView.goBack();
        }else {
            DeviceEventEmitter.emit('showToast','到顶了');
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={this.state.title}
                    style={{backgroundColor: '#6495ED'}}
                />
                <View style={styles.searchContainer}>
                    <Text style={styles.button}
                          onPress={()=> {
                              this.goBack()
                          }}>
                        返回</Text>
                    <TextInput
                        onChangeText={text=>this.searchText = text}
                        defaultValue={URL}
                        style={styles.input}
                    />
                    <Text style={styles.button}
                          onPress={()=> {
                              this.search()
                          }}>
                        Go</Text>
                </View>
                <WebView
                    ref={webView=>this.webView=webView}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                    source={{uri:this.state.url}}
                />
            </View>)
    }
}
const styles = StyleSheet.create({
        container: {
            flex: 1,

        },
        button: {
            fontSize: 16,
            padding:5
        },
        input: {
            borderWidth: 1,
            height: 40,
            flex:1,
            marginLeft:5
        },
        searchContainer: {
            flexDirection:'row',
            alignItems:'center',
            margin:10,
            marginLeft:0
        }
    }
)
