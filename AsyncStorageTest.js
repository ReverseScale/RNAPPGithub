/**
 * Created by penn on 2016/12/19.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    AsyncStorage,
    TextInput,
} from 'react-native';
import NavigationBar from './js/common/NavigationBar'
import Toast, {DURATION} from 'react-native-easy-toast'
export default class AsyncStorageTest extends Component {
    constructor(props) {
        super(props);
    }

    save() {
        AsyncStorage.setItem('text', this.text, (error)=> {
            if (!error) {
                this.toast.show('保存成功', DURATION.LENGTH_LONG);
            } else {
                this.toast.show('保存失败', DURATION.LENGTH_LONG);
            }
        });
    }

    get() {
        AsyncStorage.getItem('text', (error, result)=> {
            if (error) {
                this.toast.show('取出失败', DURATION.LENGTH_LONG);
            } else {
                if (result) {
                    this.toast.show('取出的结果为:' + result, DURATION.LENGTH_LONG);
                } else {
                    this.toast.show('没有找到对应的内容', DURATION.LENGTH_LONG);
                }
            }
        });
    }
    remove(){
        AsyncStorage.removeItem('text',(error)=>{
            if (!error) {
                this.toast.show('移除成功', DURATION.LENGTH_LONG);
            } else {
                this.toast.show('移除失败', DURATION.LENGTH_LONG);
            }
        });
    }
    render() {
        return (
            <View>
                <NavigationBar
                    title="AsyncStorage的使用"/>
                <TextInput style={{height: 30, borderWidth: 1}}
                           onChangeText={(text)=> {
                               this.text = text;
                           }}
                />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.text} onPress={()=>this.save()}>
                        保存
                    </Text>
                    <Text style={styles.text} onPress={()=>this.remove()}>
                        移除
                    </Text>
                    <Text style={styles.text} onPress={()=>this.get()}>
                        取出
                    </Text>
                </View>
                <Toast ref={toast=> {
                    this.toast = toast
                }}/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        margin:10
    }
})