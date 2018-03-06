/**
 * Created by penn on 2016/12/14.
 */

import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native'
import CustomKeyPage from './CustomKeyPage'
import SortKeyPagePage from './SortKeyPagePage'
import NavigationBar from '../../../js/common/NavigationBar'
export default class MyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            what: ''
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='我的'

                />
                <Text
                    style={styles.tips}
                    onPress={()=>{
                        this.props.navigator.push({
                            component:CustomKeyPage,
                            params:{...this.props}
                        })
                    }}
                >
                    自定义标签
                </Text>
                <Text
                    style={styles.tips}
                    onPress={()=>{
                        this.props.navigator.push({
                            component:SortKeyPagePage,
                            params:{...this.props}
                        })
                    }}
                >
                    标签排序
                </Text>
                <Text
                    style={styles.tips}
                    onPress={()=>{
                        this.props.navigator.push({
                            component:CustomKeyPage,
                            params:{...this.props,isRemoveKey:true}
                        })
                    }}
                >
                    标签移除
                </Text>
            </View>)
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    tips: {
        fontSize: 29
    }
})
