import React,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import Girl from './Girl'
export default class Boy extends Component{
    constructor(props){
        super(props);
        this.state={
            word:''
        }
    }
    render(){
        return(
            <View style={styles.constructor}>
                <Text style={styles.text}>I am boy</Text>
                <Text style={styles.text}
                      onPress={()=>{
                          this.props.navigator.push({
                              component:Girl,
                              params:{
                                  word:'一车轮胎',
                                  onCallBack:(word)=>{
                                      this.setState({
                                          word:word
                                      })
                                  }
                              }
                          })
                      }}>送你一车轮胎</Text>
                <Text style={styles.text}>{this.state.word}</Text>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'gray',
        justifyContent:'center',
    },
    text:{
        fontSize:20,
    }
})