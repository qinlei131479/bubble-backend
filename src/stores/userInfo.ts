import {defineStore} from 'pinia';
import {Session} from '/@/utils/storage';
import {getUserInfo, login, loginByMobile, loginBySocial, refreshTokenApi} from '/@/api/login/index';
import {useMessage} from '/@/hooks/message';
import mittBus from '/@/utils/mitt';

/**
 * @function useUserInfo
 * @returns {UserInfosStore}
 */
export const useUserInfo = defineStore('userInfo', {
    state: (): UserInfosState => ({
        userInfos: {
            userName: '',
            photo: '',
            time: 0,
            roles: [],
            authBtnList: [],
        },
    }),

    actions: {
        /**
         * 登录方法
         * @function login
         * @async
         * @param {Object} data - 登录数据
         * @returns {Promise<Object>}
         */
        async login(data: any) {
            data.grant_type = 'password';
            data.scope = 'server';

            return new Promise((resolve, reject) => {
                login(data)
                    .then((res) => {
                        // 存储token 信息
                        Session.set('token', res.access_token);
                        Session.set('refresh_token', res.refresh_token);
                        resolve(res);
                    })
                    .catch((err) => {
                        useMessage().error(err?.msg || '系统异常请联系管理员');
                        reject(err);
                    });
            });
        },

        /**
         * 手机登录方法
         * @function loginByMobile
         * @async
         * @param {Object} data - 登录数据
         * @returns {Promise<Object>}
         */
        async loginByMobile(data: any) {
            return new Promise((resolve, reject) => {
                loginByMobile(data.mobile, data.code)
                    .then((res) => {
                        // 存储token 信息
                        Session.set('token', res.access_token);
                        Session.set('refresh_token', res.refresh_token);
                        resolve(res);
                    })
                    .catch((err) => {
                        useMessage().error(err?.msg || '系统异常请联系管理员');
                        reject(err);
                    });
            });
        },

        /**
         * 社交账号登录方法
         * @function loginBySocial
         * @async
         * @param {string} state - 状态
         * @param {string} code - 代码
         * @returns {Promise<Object>}
         */
        async loginBySocial(state: any, code: string) {
            return new Promise((resolve, reject) => {
                loginBySocial(state, code)
                    .then((res) => {
                        // 存储token 信息
                        Session.set('token', res.access_token);
                        Session.set('refresh_token', res.refresh_token);
                        resolve(res);
                    })
                    .catch((err) => {
                        useMessage().error(err?.msg || '系统异常请联系管理员');
                        reject(err);
                    });
            });
        },

        /**
         * 刷新token方法
         * @function refreshToken
         * @async
         * @returns {Promise<any>}
         */
        async refreshToken() {
            return new Promise((resolve, reject) => {
                const refreshToken = Session.get('refresh_token');
                refreshTokenApi(refreshToken)
                    .then((res) => {
                        // 存储token 信息
                        Session.set('token', res.access_token);
                        Session.set('refresh_token', res.refresh_token);
                        resolve(res);
                    })
                    .catch((err) => {
                        useMessage().error(err.msg);
                        reject(err);
                    });
            });
        },

        /**
         * 获取用户信息方法
         * @function setUserInfos
         * @async
         */
        async setUserInfos() {
            await getUserInfo().then((res) => {
                const userInfo: any = {
                    user: res.data,
                    time: new Date().getTime(),
                    roles: res.data.roleList,
                    authBtnList: res.data.permissions,
                };
                this.userInfos = userInfo;
                // 重新加载水印
                mittBus.emit('updateWartermark');
            });
        },
    },
});
