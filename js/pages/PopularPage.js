/**
 * Created by penn on 2016/12/21.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    ListView,
    RefreshControl,
    DeviceEventEmitter
} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import DataRepository from '../expand/dao/DataRepository'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RepositoryCell from '../common/RepositoryCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import RepositoryDetail from './RepositoryDetail'

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state = {
            result: '',
            languages: [],
        }
        this.loadLanguage();
    }

    componentDidMount() {
    }

    loadLanguage() {
        this.languageDao.fetch().then((languages)=> {
            if (languages) {
                this.setState({
                    languages: languages,
                });
            }
        }).catch((error)=> {

        });
    }

    render() {
        let navigationBar =
            <NavigationBar
                title={'最热'}
                statusBar={{backgroundColor: "#2196F3"}}
            />;
        let content = this.state.languages.length > 0 ?
            <ScrollableTabView
                tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                tabBarInactiveTextColor='mintcream'
                tabBarActiveTextColor='white'
                ref="scrollableTabView"
                tabBarBackgroundColor="#2196F3"
                initialPage={0}
                renderTabBar={() => <ScrollableTabBar style={{height: 40, borderWidth: 0, elevation: 2}}
                                                      tabStyle={{height: 39}}/>}
            >
                {this.state.languages.map((reuslt, i, arr)=> {
                    let language = arr[i];
                    return language.checked ? <PopularTab key={i} tabLabel={language.name} {...this.props}/> : null;
                })}
            </ScrollableTabView> : null;
        return <View style={styles.container}>
            {navigationBar}
            {content}
        </View>
    }
}
class PopularTab extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository();
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2}),
            isLoading: false,
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.setState({
            isLoading: true
        })
        let url=this.genFetchUrl(this.props.tabLabel);

        this.dataRepository
            .fetchRepository(url)
            .then(result=> {
                let items=result && result.items ? result.items : result ? result : [];
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items),
                    isLoading: false
                });
                DeviceEventEmitter.emit('showToast', '显示缓存数据');
                if (result && result.update_date && !this.dataRepository.checkDate(result.update_date)) {
                    return this.dataRepository.fetchNetRepository(url);
                }
            })
            .then((items)=> {
                if (!items || items.length === 0)return;
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items),
                });
                DeviceEventEmitter.emit('showToast', '显示网络数据');
                console.log(e);
            })
            .catch(error=> {
                console.log(error);
                this.setState({
                    isLoading: false
                });
            })
    }
    onSelectRepository(item) {
        this.props.navigator.push({
            title: item.full_name,
            component: RepositoryDetail,
            params: {
                item: item,
                ...this.props
            },
        });
    }
    genFetchUrl(key) {
        return URL + key + QUERY_STR;
    }

    renderRow(data) {
        return <RepositoryCell
            key={data.id}
            data={data}
            onSelect={()=>this.onSelectRepository(data)}
        />
    }

    render() {
        return <View style={styles.container}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data)=>this.renderRow(data)}
                refreshControl={
                    <RefreshControl
                        title='Loading...'
                        titleColor='#2196F3'
                        colors={['#2196F3']}
                        refreshing={this.state.isLoading}
                        onRefresh={()=>this.loadData()}
                        tintColor='#2196F3'
                    />
                }
            />
        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    tips: {
        fontSize: 20
    }
})
