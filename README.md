# RNAPPGithub

# 学习课程：
《双平台真实开发GitHub App React Native技术全面掌握》

Github 代码库：https://github.com/ReverseScale/RNAPPGithub.git

# 知识点：
* 1.整理 ReactNative 网络封装及常用的三方模块
* 2.ReactNative 的 AsyncStorage数据库技术、离线缓存
* 3.ReactNative 的数据 DAO 层设计技巧，数据状态实时更新
* 4.ReactNative 的代码提取技巧，组合模式应用技巧，数据异步刷新与动态添加
* 5.ReactNative 的版本升级、数据统计、社会化分享、第三方登录，热更新等
* 6.ReactNative 项目发布前的优化、打包与上线

# 目录结构：
- [生命周期及使用场景](#生命周期及使用场景)
- [项目介绍](#项目介绍)
- [组件化](#组件化)
- [集成与管理](#集成与管理)
- [布局约束](#布局约束)
- [组件封装](#组件封装)
- [本地持久化](#本地持久化)
- [网络请求封装](#网络请求封装)
- [功能调试](#功能调试)
- [双平台适配](#适配双平台适配)
- [开源组件库的使用](#开源组件库的使用)
- [热更新](#热更新)

## 生命周期及使用场景
常用方法：
- constructor:
- componentWillMount:
- render:
- componentDidMount:
- componentWillReceiveProps:
- shouldComponentUpdate:
- componentWillUpdate:
- componentDidUpdate
- componentWillUnmount:

### 1.constructor:
在组件创建的时候调用一次,这个方法进行this.state初始化状态机。
```js
constructor(props) {
     super(props);  // 初始状态
     this.state = {
         isShow:true
     };
}
```
### 2.componentWillMount:
在组件生命周期中只会被执行一次,在初始渲染(render函数)前被执行。
注意:

- 如果这个函数通过setState函数修改状态机变量,RN框架不会额外执行渲染(界面刷新)
- 
- 如果子组件也有componentWillMount函数使用,会在父组件之后调用

- 需要从本地存储中读取数据用于显示,常用这个函数

### 3.render:
该函数组件必有的，通过返回JSX或其他组件来构成DOM,换言之，就是组件的核心渲染过程。

### 4.componentDidMount:
在React Native组件的生命周期中,这个函数只会被执行一次，它在初始渲染完成后会马上被调用。在这之后开发者可以通过子组件的引用来访问，操作任何子组件.
如果RN组件的子组件也有componentDidMount函数，并会在父组件的componentDidMount函数之前被调用。

- 常用来网络请求数据

### 5.componentWillReceiveProps:
在React Native组件的初始渲染完成后，props改变时，这个函数被调用，参数是个新的props。

### 6.shouldComponentUpdate:
React Native组件的初始渲染执行完成后, RN组件接收到新的state或者props时这个函数会调用。

- 通过这个函数阻止无必要的重新渲染，是提高React Native应用程序性能的一大技巧。

### 7.componentWillUpdate:
初始渲染完成后,重新渲染前会调用这个函数。

- 这个函数不能通过this.setState再次改变状态机变量的值。

- 组件更新时调用。

### 8.componentDidUpdate
RN组件初始渲染完成后，RN框架在重新渲染RN组件完成后调用。
参数是渲染前的props和state。

- 组件更新完毕时调用。

### 9.componentWillUnmount:
ReactNative 组件被卸载前会调用，通常做一些清理内容。

---
## 项目介绍
双平台效果预览：

![](https://user-gold-cdn.xitu.io/2018/3/29/16270d10d158f637?w=814&h=608&f=png&s=400633)

React Native是React在移动端的跨平台方案。如果想更快地理解和掌握React Native开发，就必须先了解React。

React是FaceBook开源的一个前端框架，它起源于 Facebook 的内部项目，并于 2013 年 5 月开源。因为React 拥有较高的性能，代码逻辑非常简单，所以越来越多的人已开始关注和使用它，目前该框架在Github上已经有7万+star。

ReactNative 技术导图：

![](https://user-gold-cdn.xitu.io/2018/3/29/16270d28bc94375d?w=718&h=306&f=png&s=92798)

## 组件化
React采用组件化的方式开发，通过将view构建成组件，使得代码更加容易得到复用，能够很好的应用在大项目的开发中。有一句话说的很形象：在React中，构建应用就像搭积木一样。

### 组件化特征
React认为一个组件应该具有如下特征：

- 可组合（Composeable）：一个组件易于和其它组件一起使用，或者嵌套在另一个组件内部。如果一个组件内部创建了另一个组件，那么说父组件拥有它创建的子组件，通过这个特性，一个复杂的UI可以拆分成多个简单的UI组件；

- 可重用（Reusable）：每个组件都是具有独立功能的，它可以被使用在多个UI场景；

- 可维护（Maintainable）：每个小的组件仅仅包含自身的逻辑，更容易被理解和维护；

![](https://user-gold-cdn.xitu.io/2018/3/29/16270d596bf5c9ca?w=358&h=704&f=png&s=90318)

封装好的导航栏就可以被称之为一个组件，它符合上述三个特点：

- 可组合：可以将导航栏组件放在页面组件中作为页面组件的子组件。而且在导航栏组件的内部，也有按钮组件等子组件。

- 可重用：如果封装好了该组件，就可以放在任意需要导航栏的页面（组件）使用，也可以放在其他项目中使用。

- 可维护：因为具有独立的功能和展示逻辑，所以便于定位和修改。


### 组件的属性与状态

在React Native（React.js）里，组件所持有的数据分为两种：

- 属性（props）：组件的props是不可变的，它只能从其他的组件（例如父组件）传递过来。

- 状态（state）：组件的state是可变的，它负责处理与用户的交互。在通过用户点击事件等操作以后，如果使得当前组件的某个state发生了改变，那么当前组件就会触发render()方法刷新自己。

![](https://user-gold-cdn.xitu.io/2018/3/29/16270d8c07bddb39?w=358&h=704&f=png&s=77915)

我们可以看到这个页面有两个子页面，一个是‘最热’页面（组件），另一个是‘趋势‘页面（组件）。那么这两个组件都有什么props和state呢？

1.props：
由于props是从其父组件传递过来的，那么可想而知，props的声明应该是在当前组件的父组件里来做。在React Native中，通常props的声明是和当前组件的声明放在一起的：

```js
//最热子页面
<FavoriteTabPage  {...this.props} tabLabel='最热' flag={FlAG_STORAGE.flag_popular}/>
//趋势子页面
<FavoriteTabPage  {...this.props} tabLabel='趋势' flag={FlAG_STORAGE.flag_trending}/>
```

在这里，收藏页面是父组件，而最热页面和趋势页面是其子组件。在收藏页面组件里声明了最热页面和趋势页面的组件。

而且我们也可以看到，最热页面和趋势页面组件都用的是同一个组件：FavoriteTabPage，而这两个页面的不同点只在于传入的两个props的不同：tabLabel和flag。

而在FavoriteTabPage组件内部，如果想调用flag这个props，可以使用this.props.flag来调用。

2.state:

下面是最热和趋势页面的组件：

```js
class FavoriteTabPage extends Component{
//组件的构造方法
constructor(props){
    super(props);
    this.state={
    dataSource:new ListView.DataSource({rowHasChanged:(r1,r2)=>r1!==r2}),isLoading:false,
    }
}
```
这里面定义了两个state:

- dataSource:列表的数据源
- isLoading:是否正在刷新

这两个state都是将来可能经常变化的。比如在网络请求以后，列表的数据源会被替换掉，这个时候就要调用:

```js
this.setState({
      //把新的值newDataArr对象传给dataSource
      dataSource:newDataArr
})
```

3.DOM
DOM 是前端的一个概念，暂时可以粗略理解为一个页面的树形结构。
React 生命周期的三大阶段
- Mounting：已插入真实 DOM
- Updating：正在被重新渲染
- Unmounting：已移出真实 DOM

在每个阶段都有相应的状态和与之对应的回调函数，具体可以看下图：

![](https://user-gold-cdn.xitu.io/2018/3/29/16270debf54570c4?w=740&h=900&f=jpeg&s=63320)

上图来自：贾鹏辉的技术博客：React Native之React速学教程(中)/)

## 集成与管理
1.指定版本初始化
在终端输入react-native demo --version 0.40.0命令以后，就会初始化一个React Native版本为0.40.0的项目。这个最初项目里面直接就包含了iOS和Android的工程文件夹，可以用对应的IDE打开后编译运行。

在新建一个React Native项目之后的根目录结构是这样的：

![](https://user-gold-cdn.xitu.io/2018/3/29/1627105390f390e6?w=624&h=379&f=png&s=60739)

2.使用 Cocoapods 管理 ReactNative
Podfile 文件格式：
```
pod 'React', :path => './node_modules/react-native', :subspecs => [
  'Core',
  'RCTText',
  'RCTImage',
  'RCTActionSheet',
  'RCTGeolocation',
  'RCTNetwork',
  'RCTSettings',
  'RCTVibration',
  'RCTWebSocket',
  ]
```
ReactNative 0.42.0 以上版本需在 Podfile 配置 yoga：
```
# 如果你的RN版本 >= 0.42.0，请加入下面这行
pod "yoga", :path => "./node_modules/react-native/ReactCommon/yoga"
```

输入react-native run-ios或者react-native run-android指令， 就会自动打开模拟器运行项目(前提是安装了相应的开发环境)。

但是一个比较完整的项目仅仅有这些类别的文件是不够的，还需要一些工具类，模型类，资源等文件。为了很好地区分它们，使项目结构一目了然，需要组织好项目文件夹以及类的命名，下面是我将教程里的文件夹命名和结构稍加修改后的一个方案，可供大家参考：

![](https://user-gold-cdn.xitu.io/2018/3/29/16271082c4091e40?w=707&h=628&f=png&s=121488)

## 布局约束
采用Flex布局的元素，被称为Flex container，其所有子元素被称为Flex item；容器默认存在两个轴，分别是主轴（main axis）和垂直的交叉轴（cross axis）,主轴开始的位置叫做main start，结束的位置叫main end；交叉轴的开始位置叫做cross start，结束的位置叫做cross end；单个item占据的主轴空间叫做main size，占据的交叉轴控件叫做cross size。

如下图所示：

![](https://user-gold-cdn.xitu.io/2018/3/29/16270e1ee5a277a9?w=563&h=333&f=png&s=10005)

组件化驱动下，搜索结果页中展示的 Cell 与之前的列表页 Cell 可以重用：

![](https://user-gold-cdn.xitu.io/2018/3/29/16270e3fbd81a480?w=358&h=704&f=png&s=74402)

我们把该组件定名为：RespositoryCell，结合代码来看一下具体的实现：
```js
export default class RepositoryCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png'),
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setFavoriteState(nextProps.projectModel.isFavorite)
    }
    setFavoriteState(isFavorite) {
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png')
        })
    }
    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite)
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite)
    }
    render() {
        let item = this.props.projectModel.item? this.props.projectModel.item:this.props.projectModel;
        let favoriteButton=this.props.projectModel.item?
            <TouchableOpacity
                style={{padding:6}}
                onPress={()=>this.onPressFavorite()} underlayColor='transparent'>
                <Image
                    ref='favoriteIcon'
                    style={[{width: 22, height: 22,},this.props.theme.styles.tabBarSelectedIcon]}
                    source={this.state.favoriteIcon}/>
            </TouchableOpacity>:null;
        return (
            <TouchableOpacity
                onPress={this.props.onSelect}
                style={styles.container}
            >
                <View style={styles.cell_container}>
                    <Text style={styles.title}>{item.full_name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text>Author:</Text>
                            <Image
                                style={{height: 22, width: 22}}
                                source={{uri: item.owner.avatar_url}}
                            />
                        </View>
                        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                            <Text>Star:</Text>
                            <Text>{item.stargazers_count}</Text>
                        </View>
                        {favoriteButton}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}
```
- 这里声明了RespositoryCell组件，它继承于Component，也就是组件类，即是说，声明组件的时候必须都要继承与这个类。

- 集中看一下该组件的render方法，它返回的是该组件的实际布局：在语法上使用JSX，类似于HTML的标签式语法，很清楚地将cell的层级展现了出来：

    - 最外层被一个View组件包裹着，里面第一层有三个子组件：两个Text组件和一个作为底部背景的View组件。

    - 底部背景的View组件又有三个子组件：View组件（显示作者信息），View组件（显示star信息）,收藏按钮。
    
结构分解图：

![](https://user-gold-cdn.xitu.io/2018/3/29/16270dfa999713c4?w=739&h=165&f=png&s=27366)

## 组件封装

| 我的页面 | 个人中心 |
| ------------- | ------------- | 
| ![](https://user-gold-cdn.xitu.io/2018/3/29/16270e8a3f60ae27?w=358&h=704&f=png&s=148723) | ![](https://user-gold-cdn.xitu.io/2018/3/29/16270eb1d31699b8?w=358&h=704&f=png&s=158600)|

对于“我的页面”和“个人中心”这类结构相似的页面，建议进行组件封装，封装后的 AboutPage 实现代码简洁如下：

```js
export default class AboutPage extends Component{
    constructor(props) {
        super(props);
        this.aboutCommon=new AboutCommon(props,(dic)=>this.updateState(dic),FLAG_ABOUT.flag_about,config);
        this.state = {
            projectModels: [],
            author:config.author
        }
    }
    componentDidMount() {
        this.aboutCommon.componentDidMount();
    }
    componentWillUnmount() {
        this.aboutCommon.componentWillUnmount();
    }
    updateState(dic){
        this.setState(dic);
    }
    onClick(tab) {
        let TargetComponent, params = {...this.props,menuType:tab};
        switch (tab) {
            case MORE_MENU.About_Author:
                TargetComponent = AboutMePage;
                break;
            case MORE_MENU.Website:
                TargetComponent = WebViewPage;
                params.title='GitHubPopular';
                var url='https://reversescale.github.io';
                params.url=url;
                break;
            case MORE_MENU.Feedback:
                var url='mailto://reversescale@icloud.com';
                Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + url);
                    } else {
                        return Linking.openURL(url);
                    }
                }).catch(err => console.error('An error occurred', err));
                break;
            case MORE_MENU.Share:
                break;

        }
        if (TargetComponent) {
            this.props.navigator.push({
                component: TargetComponent,
                params: params,
            });
        }
    }
    render() {
        let content=<View>
            {this.aboutCommon.renderRepository(this.state.projectModels)}
            {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.Website), require('../../../res/images/ic_computer.png'), MORE_MENU.Website, this.props.theme.styles.tabBarSelectedIcon)}
            <View style={GlobalStyles.line}/>
            {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.About_Author), require('../my/img/ic_insert_emoticon.png'), MORE_MENU.About_Author, this.props.theme.styles.tabBarSelectedIcon)}
            <View style={GlobalStyles.line}/>
            {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.Feedback), require('../../../res/images/ic_feedback.png'), MORE_MENU.Feedback, this.props.theme.styles.tabBarSelectedIcon)}
        </View>
        return this.aboutCommon.render(content, {
            'name': 'GitHub Popular',
            'description': '这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台。',
            "avatar": "http://og1yl0w9z.bkt.clouddn.com/18-3-28/61685877.jpg",
            "backgroundImg": "http://og1yl0w9z.bkt.clouddn.com/18-3-28/37407402.jpg",
        });
    }
}
```

## 本地持久化

| 主题选择界面 | 切换主题后界面 |
| ------------- | ------------- | 
| ![](https://user-gold-cdn.xitu.io/2018/3/29/16270fccfcb56db1?w=358&h=704&f=png&s=35862) | ![](https://user-gold-cdn.xitu.io/2018/3/29/16270f47940dd642?w=358&h=704&f=png&s=89782) |

在涉及如主题变更等操作时，需要将状态信息保存，这时就需要用到类似于iOS 中的NSUserDefault， AsyncStorage 是React Native中的 Key-Value 存储系统，可以做本地持久化。

首先看它主要的几个接口：

根据键来获取值，获取的结果会放在回调函数中：
```js
static getItem(key: string, callback:(error, result))
```
根据键来设置值：
```js
static setItem(key: string, value: string, callback:(error))
```
根据键来移除项：
```js
static removeItem(key: string, callback:(error))
```
获取所有的键：
```js
static getAllKeys(callback:(error, keys))
```
设置多项，其中 keyValuePairs 是字符串的二维数组，比如：[['k1', 'val1'], ['k2', 'val2']]：
```js
static multiSet(keyValuePairs, callback:(errors))
```
获取多项，其中 keys 是字符串数组，比如：['k1', 'k2']：
```js
static multiGet(keys, callback:(errors, result))
```
删除多项，其中 keys 是字符串数组，比如：['k1', 'k2']：
```js
static multiRemove(keys, callback:(errors))
```
清除所有的项目：
```js
static clear(callback:(error))
```

## 网络请求封装

在React Native中，经常使用Fetch函数来实现网络请求，它支持GET和POST请求并返回一个Promise对象，这个对象包含一个正确的结果和一个错误的结果。

来看一下用Fetch发起的POST请求封装：

```js
static post(url,data){
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method:'POST',
                header:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(data)
            })
                .then(response=>response.json())
                .then(result=>{
                    resolve(result);
                })
                .catch(error=>{
                    reject(error);
                })
        })
    }
```
从上面的代码中，我们可以大致看到：Fetch函数中，第一个参数是请求url，第二个参数是一个字典，包括方法，请求头，请求体等信息。

随后的then和catch分别捕捉了fetch函数的返回值：一个Promise对象的正确结果和错误结果。注意，这里面有两个then，其中第二个then把第一个then的结果拿了过来。而第一个then做的事情是把网络请求的结果转化为JSON对象。

那么什么是Promise对象呢？

Promise 是异步编程的一种解决方案，Promise对象可以获取某个异步操作的消息。它里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。

它分为三种状态：

Pending（进行中）、Resolved（已成功）和Rejected（已失败）

它的构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject：
- resolve函数的作用：将Promise对象的状态从“未完成”变成“成功”(即从Pending变为Resolved)，在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；
- reject函数的作用：将Promise对象的状态从“未完成”变成“成功”(即从Pending变为Rejected)，在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

GET 请求封装：
```js
static get(url){
        return new Promise((resolve,reject)=>{
            fetch(url)
                .then(response=>response.json())
                .then(result=>{
                    resolve(result);
                })
                .catch(error=>{
                    reject(error);
                })
        })
    }
```
因为只是GET请求，所以不需要配置请求体，而且因为这个fetch函数返回值是一个Promise对象， 所以我们可以用.then和.catch来捕捉正确和错误的结果。

## 功能调试

我们可以使用浏览器的开发者工具来调试React Native项目，可以通过打断点的方式来看数据信息以及方法的调用：

- 首先在iOS模拟器中点击command + D，然后再弹出菜单里点击Debug JS Remotely。随后就打开了浏览器进入了调试。

![](https://user-gold-cdn.xitu.io/2018/3/29/16271023c1f9396f?w=358&h=704&f=png&s=62408)

- 浏览器一般会展示下面的页面，然后点击command + option + J进入真生的调试界面。

![](https://user-gold-cdn.xitu.io/2018/3/29/1627102aa331c056?w=957&h=645&f=png&s=213866)

## 双平台适配

因为React Native讲求的是一份代码跑在两个平台上，而客观上这两个平台又有一些不一样的地方，所以就需要在别要的时候做一下两个平台的适配。

例如导航栏：在iOS设备中是存在导航栏的，而安卓设备上是没有的。所以在定制导航栏的时候，在不同平台下给导航栏设置不同的高度：

```js
const NAV_BAR_HEIGHT_IOS = 54;
const NAV_BAR_HEIGHT_ANDROID = 50;

// css
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
    },
```
上面的Platform是React Native内置的用于区分平台的库，可以在引入后直接使用。

建议在调试程序的时候，同时打开iOS和Android的模拟器进行调试，因为有些地方可能在某个平台上是没问题的，但是另一个平台上有问题，这就需要使用Platform来区分平台。


## 开源组件库的使用
ReactNative 的组件与原生的组件有许多共同之处，如下拉刷新，同样的 Github 中开源组件已经相当完善。

![](https://user-gold-cdn.xitu.io/2018/3/29/162710e8caa81348?w=347&h=706&f=gif&s=599458)

开源组件库方法如下，安装最新版本：
```
npm install react-native-tab-navigator --save
```
安装指定版本：
```
npm install --save react-native-tab-navigator@0.4.0
```
react-native 集成组件绑定(ReactNative 0.27以后，自集成RNPM)：
```
react-native link react-native-splash-screen
```
常用开源库：
```
npm install --save react-native-tab-navigator@0.4.0
npm install --save react-native-scrollable-tab-view@0.7.0
npm install --save react-native-check-box@1.0.4
npm install --react-native-easy-toast@1.0.9
npm install --save GitHubTrending@2.0.0
npm install --save react-native-htmlview@0.5.0
npm install --save react-native-popover@0.5.0
npm install --react-native-splash-screen@2.0.0
```
下图为使用 react-native-splash-screen 后的效果演示：

![](https://user-gold-cdn.xitu.io/2018/3/29/16271098701076c5?w=358&h=704&f=png&s=31664)

## 热更新
CodePush 是微软提供的一套用于热更新 React Native 和 Cordova 应用的服务。

CodePush 是提供给 React Native 和 Cordova 开发者直接部署移动应用更新给用户设备的云服务。CodePush 作为一个中央仓库，开发者可以推送更新 (JS, HTML, CSS and images)，应用可以从客户端 SDK 里面查询更新。

Code-Push 推包命令：
```
code-push release-react <appName> <platform> [options]
```
示例：
```
code-push release-react RNAPPGithub ios --t 1.0.0 --dev false --d Staging --des "1.热更新我的页面背景色" --m true
```
```
code-push release-react RNAPPGithub ios --t 1.0.1 --dev false --d Staging --des "1.热更新相关设置" --m true
```

Code-Push 线上查看更新：
```
code-push deployment ls RNAPPGithub
```
Code-Push 查看项目Key：
```
code-push deployment ls RNAPPGithub -k
```
Code-Push iOS更新打包方法：
```
react-native bundle --platform ios --entry-file index.ios.js --bundle-output release_ios/main.jsbundle --assets-dest release_ios/ --dev fasle
```

# 总结
之前也有零零散散的调研这门技术，但是经过系统的 15 个下午的坚持学习，深感跨平台技术的独到之处，特别是在与原生交互的编写上简直让人欲生欲死，还好在 Github 上已经有各路大神开源的各种方便开发的组件库可以供我们使用。

# 分享链接
《React Native 开发常用命令行（持续更新）》(https://juejin.im/post/5abc54c86fb9a028da7c998c)

《ReactNative 开发常用的三方模块》(https://www.jianshu.com/p/53ff78168acc)

《使用VS Code调试React-Native程序》（https://jingyan.baidu.com/article/ad310e80fb13fc1849f49ed1.html）

# 参考资料
- React Native中文网

- 贾鹏辉的技术博客

- 从一个实战项目来看一下React Native开发的几个关键技术点

- Marno:给所有开发者的React Native详细入门指南

- 大漠:一个完整的Flexbox指南

- 阮一峰:Flex 布局教程：语法篇

- 八段代码彻底掌握 Promise

- 阮一峰：Promise对象
- asce1885:React Native 高质量学习资料汇总

- 世锋日上:ReactNative 学习资源大汇集

