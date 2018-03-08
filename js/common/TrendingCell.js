import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native'
import HTMLView from 'react-native-htmlview'
export default class TrendingCell extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let data = this.props.data
        var description='<p>'+data.description+'</p>';

        return (
            <TouchableOpacity
                onPress={this.props.onSelect}
                style={styles.container}
            >
                <View style={styles.cell_container}>
                    <Text style={styles.title}>{data.fullName}</Text>
                    <HTMLView
                        value={data.description}
                        onLinkPress={(url)=>{

                        }}
                        StyleSheet={{
                            p:styles.description,
                            a:styles.description,
                        }}
                    />
                    <Text style={styles.description}>{data.meta}</Text>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text style={styles.description}>Build by:</Text>
                            {data.contributors.map((result,i,arr)=>{
                                return <Image
                                    key={i}
                                    style={{height: 22, width: 22}}
                                    source={{uri: arr[i]}}
                                />
                            })}
                            
                        </View>
                        
                        <Image
                            style={{width: 22, height: 22}}
                            source={require('../../res/images/ic_star.png')}
                        />
                    </View>


                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121',
        flex: 1
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    },
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: {width:0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation:2
    }
})