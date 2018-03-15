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
    DeviceEventEmitter,
    TouchableOpacity,
} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import DataRepository,{FLAG_STORAGE} from '../expand/dao/DataRepository'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import RepositoryCell from '../common/RepositoryCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import SearchPage from './SearchPage'
import FavoriteDao from '../expand/dao/FavoriteDao'
import ProjectModel from '../model/ProjectModel'
import Utils from '../util/Utils'
import ActionUtils from '../util/ActionUtils'
const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
var dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state = {
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
    renderRightButton() {
        return (
            <View style={{flexDirection: 'row',}}>
                <TouchableOpacity
                    ref='button'
                    underlayColor='transparent'
                    onPress={()=>{
                        this.props.navigator.push({
                            component: SearchPage,
                            params: {
                                theme:this.state.theme,
                                ...this.props,
                            },
                        });
                    }}>
                    <View style={{padding:5,marginRight:8}}>
                        <Image
                            style={{width: 24, height: 24}}
                            source={require('../../res/images/ic_search_white_48pt.png')}
                        />
                    </View>
                </TouchableOpacity>
            </View>)
    }
    render() {
        let navigationBar =
            <NavigationBar
                title={'最热'}
                statusBar={{backgroundColor: "#2196F3"}}
                rightButton={this.renderRightButton()}
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
        this.isFavoriteChanged=false;
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2}),
            isLoading: false,
            favoriteKeys: [],
        }
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('favoriteChanged_popular', () => {
            this.isFavoriteChanged=true;
        });
        this.loadData();
    }
    componentWillUnmount(){
        if (this.listener) {
            this.listener.remove();
        }
    }
    componentWillReceiveProps(nextProps) {
        if(this.isFavoriteChanged){
            this.isFavoriteChanged=false;
            this.getFavoriteKeys();
        }
    }
    /**
     * 更新ProjectItem的Favorite状态
     */
    flushFavoriteState() {
        let projectModels = [];
        let items = this.items;
        for (var i = 0, len = items.length; i < len; i++) {
            projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i],this.state.favoriteKeys)));
        }
        this.updateState({
            isLoading: false,
            isLoadingFail: false,
            dataSource: this.getDataSource(projectModels),
        });
    }

    /**
     * 获取本地用户收藏的ProjectItem
     */
    getFavoriteKeys() {
        favoriteDao.getFavoriteKeys().then((keys)=> {
            if (keys) {
                this.updateState({favoriteKeys: keys});
            }
            this.flushFavoriteState();
        }).catch((error)=> {
            this.flushFavoriteState();
            console.log(error);
        });
    }
    updateState(dic) {
        if (!this)return;
        this.setState(dic);
    }
    loadData() {
        this.updateState({
            isLoading: true
        })
        let url=this.genFetchUrl(this.props.tabLabel);
        dataRepository
            .fetchRepository(url)
            .then(result=> {
                this.items=result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys();
                if (result && result.update_date && !Utils.checkDate(result.update_date))return dataRepository.fetchNetRepository(url);
            })
            .then((items)=> {
                if (!items || items.length === 0)return;
                this.items = items;
                this.getFavoriteKeys();
            })
            .catch(error=> {
                console.log(error);
                this.updateState({
                    isLoading: false
                });
            })
    }
    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }
    /**
     * favoriteIcon单击回调函数
     * @param item
     * @param isFavorite
     */
    onFavorite(item, isFavorite) {
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(item.id.toString());
        }
    }
    genFetchUrl(key) {
        return URL + key + QUERY_STR;
    }
    renderRow(projectModel) {
        return <RepositoryCell
            key={projectModel.item.id}
            projectModel={projectModel}
            onSelect={()=>ActionUtils.onSelectRepository({projectModel:projectModel,flag:FLAG_STORAGE.flag_popular,...this.props})}
            onFavorite={(item, isFavorite)=>this.onFavorite(item, isFavorite)}/>
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
