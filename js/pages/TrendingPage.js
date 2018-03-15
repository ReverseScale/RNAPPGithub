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
    TouchableOpacity
} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import DataRepository,{FLAG_STORAGE} from '../expand/dao/DataRepository'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import TrendingRepoCell from '../common/TrendingRepoCell'
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao'
import FavoriteDao from "../expand/dao/FavoriteDao"
import Popover from '../common/Popover'
import ProjectModel from "../model/ProjectModel";
import Utils from '../util/Utils'
import ActionUtils from '../util/ActionUtils'
import TimeSpan from '../model/TimeSpan'
const API_URL = 'https://github.com/trending/'
var timeSpanTextArray = [new TimeSpan('今 天', 'since=daily'),
    new TimeSpan('本 周', 'since=weekly'), new TimeSpan('本 月', 'since=monthly')]
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)
var dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
        this.state = {
            languages: [],
            isVisible: false,
            buttonRect: {},
            timeSpan: timeSpanTextArray[0],
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
    showPopover() {
        this.refs.button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }
    closePopover() {
        this.setState({isVisible: false});
    }

    onSelectTimeSpan(timeSpan) {
        this.closePopover();
        this.setState({
            timeSpan: timeSpan
        })
    }

    renderTitleView() {
        return <View >
            <TouchableOpacity
                ref='button'
                underlayColor='transparent'
                onPress={()=>this.showPopover()}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{
                        fontSize: 18,
                        color: '#FFFFFF',
                        fontWeight: '400'
                    }}>趋势 {this.state.timeSpan.showText}</Text>
                    <Image
                        style={{width: 12, height: 12, marginLeft: 5}}
                        source={require('../../res/images/ic_spinner_triangle.png')}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }

    render() {
        let navigationBar =
            <NavigationBar
                titleView={this.renderTitleView()}
                statusBar={{backgroundColor: "#2196F3"}}
            />;
        let timeSpanView=
            <Popover
                isVisible={this.state.isVisible}
                fromRect={this.state.buttonRect}
                placement="bottom"
                onClose={()=>this.closePopover()}
                contentStyle={{opacity:0.82,backgroundColor:'#343434'}}
                style={{backgroundColor: 'red'}}>
                <View style={{alignItems: 'center'}}>
                    {timeSpanTextArray.map((result, i, arr) => {
                        return <TouchableOpacity key={i} onPress={()=>this.onSelectTimeSpan(arr[i])}
                                                   underlayColor='transparent'>
                            <Text
                                style={{fontSize: 18,color:'white', padding: 8, fontWeight: '400'}}>
                                {arr[i].showText}
                            </Text>
                        </TouchableOpacity>
                    })
                    }
                </View>
            </Popover>
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
                    return language.checked ? <TrendingTab key={i} tabLabel={language.name} timeSpan={this.state.timeSpan} {...this.props}/> : null;
                })}
            </ScrollableTabView> : null;
        return <View style={styles.container}>
            {navigationBar}
            {content}
            {timeSpanView}
        </View>
    }
}
class TrendingTab extends Component {
    constructor(props) {
        super(props);
        this.isRender = true;
        this.isFavoriteChanged=false;
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2}),
            isLoading: false,
            favoriteKeys: [],
        }
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('favoriteChanged_trending', () => {
            this.isFavoriteChanged=true;
        });
        this.loadData(this.props.timeSpan);
    }
    componentWillUnmount(){
        if (this.listener) {
            this.listener.remove();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.timeSpan !== this.props.timeSpan) {
            this.loadData(nextProps.timeSpan);
        }else if(this.isFavoriteChanged){
            this.isFavoriteChanged=false;
            this.getFavoriteKeys();
        }
    }
    onUpdateFavorite() {
        this.getFavoriteKeys();
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (this.isRender) {
            this.isRender = false;
            return true;
        } else {
            return false;
        }
    }
    onRefresh(){
        this.loadData(this.props.timeSpan,true);
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
    loadData(timeSpan,isRefresh) {
        this.updateState({
            isLoading: true
        })
        let url=this.genFetchUrl(timeSpan,this.props.tabLabel);
        dataRepository
            .fetchRepository(url)
            .then(result=> {
                this.items=result && result.items ? result.items : result ? result : [];
                this.getFavoriteKeys();
                if(!this.items||isRefresh&&result && result.update_date && !Utils.checkDate(result.update_date)){
                    return dataRepository.fetchNetRepository(url);
                }
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
    updateState(dic){
        if (!this)return;
        this.isRender=true;
        this.setState(dic);
    }
    /**
     * favoriteIcon单击回调函数
     * @param item
     * @param isFavorite
     */
    onFavorite(item, isFavorite) {
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.fullName, JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(item.fullName);
        }
    }
    genFetchUrl(timeSpan, category) {//objective-c?since=daily
        return API_URL + category + '?' + timeSpan.searchText;
    }

    renderRow(projectModel) {
        return <TrendingRepoCell
                key={projectModel.item.id}
                projectModel={projectModel}
                onSelect={()=>ActionUtils.onSelectRepository({
                    projectModel:projectModel,
                    flag:FLAG_STORAGE.flag_trending,
                    onUpdateFavorite:()=>this.onUpdateFavorite(),
                    ...this.props
                })}
                onFavorite={(item, isFavorite)=>this.onFavorite(item, isFavorite)}/>
    }

    render() {
        return <View style={styles.container}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(data)=>this.renderRow(data)}
                enableEmptySections={true}
                refreshControl={
                    <RefreshControl
                        title='Loading...'
                        titleColor='#2196F3'
                        colors={['#2196F3']}
                        refreshing={this.state.isLoading}
                        onRefresh={()=>this.onRefresh()}
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
