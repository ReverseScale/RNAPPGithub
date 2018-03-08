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
import GitHubTrending from 'GitHubTrending'

const URL='https://github.com/trending/'

export default class TrendingTest extends Component {
    constructor(props) {
        super(props);
        this.trending=new GitHubTrending();
        this.state = {
            result:''
        }
    }
    onload() {
        let url=URL+this.text;
        this.trending.fetchTrending(url)
            .then(result=>{
                this.setState({
                    result:JSON.stringify(result),
                });
            })
            .catch(error=>{
                this.setState({
                    result:JSON.stringify(error),
                })
            })

    }
    render() {
        return (
            <View>
                <NavigationBar
                    title="GitHubTrending的使用"/>
                <TextInput style={{height: 30, borderWidth: 1}}
                           onChangeText={(text)=> {
                               this.text = text;
                           }}
                />
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.text} onPress={()=>this.onload()}>
                        加载数据
                    </Text>
                    <Text style={{flex:1}}>{this.state.result}</Text>
                </View>
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

