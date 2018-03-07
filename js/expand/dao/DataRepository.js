/**
 * Created by penn on 2016/12/21.
 */

import {
    AsyncStorage,
} from 'react-native';

export default class DataRepository {
    // 保存进数据库中
    saveRepository(url, items, callback) {
        if (!items || !url)return;
        let wrapData = {items: items, update_date: new Date().getTime()};
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callback);
    }

    fetchRepository(url) {
        return new Promise((resolve, reject)=> {
            // 获取本地数据
            this.fetchLocalRepository(url).then((wrapData)=> {
                if (wrapData) {
                    resolve(wrapData, true);
                } else {
                    this.fetchNetRepository(url).then((data)=> {
                        resolve(data);
                    }).catch((error)=> {
                        reject(error);
                    })
                }

            }).catch((error)=> {
                this.fetchNetRepository(url).then((data)=> {
                    resolve(data);
                }).catch((error=> {
                    reject(error);
                }))
            })
        })
    }

    /**
     * 获取本地数据
     * @param url
     * @returns {Promise<any>}
     */
    fetchLocalRepository(url) {
        return new Promise((resolve, reject)=> {
            AsyncStorage.getItem(url, (error, result)=> {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error);
                }
            })
        })
    }

    // 获取网络数据
    fetchNetRepository(url) {
        return new Promise((resolve, reject)=> {
            fetch(url)
                .then((response)=>response.json())
                .catch((error)=> {
                    reject(error);
                }).then((responseData)=> {
                if (!responseData || !responseData.items) {
                    reject(new Error('responseData is null'));
                    return;
                }
                resolve(responseData.items);
                // 保证进数组
                this.saveRepository(url, responseData.items)
            }).done();
        })
    }

    /**
     * 检查数据过期
     * @param longTime
     * @returns {boolean}
     */
    checkDate(longTime) {
        return false;
        let currentDate = new Date();
        let targetDate = new Date();
        targetDate.setTime(longTime);
        if (currentDate.getMonth() !== targetDate.getMonth())return false;
        if (currentDate.getDate() !== targetDate.getDate())return false;
        if (currentDate.getHours() - targetDate.getHours() > 4)return false;
        // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
        return true;
    }
}