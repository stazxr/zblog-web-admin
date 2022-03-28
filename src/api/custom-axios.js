import axios from "axios";
import httpConfig from './http-config'
import { Message } from 'element-ui';
import router from "@/router";

// create instance
const instance = axios.create();

// api timeout
const timeout = serverConfig.TIME_OUT;

// set response interceptor
instance.interceptors.response.use(success => {
    console.log("success", success);
    if (success.data && success.data.code === 200) {
        // 操作成功
        if (success.data.message) {
            Message.success({message: success.data.message})
        }
        return success.data;
    } else {
        // 操作失败
        if (success.data) {
            if (success.data.code === 401) {
                if (success.data.message) {
                    Message.error({message: success.data.message})
                } else {
                    Message.error({message: "尚未登录，请登录"})
                }
            } else if (success.data.code === 403) {
                Message.error({message: "权限不足，请联系管理员"})
            } else if (success.data.code === 404) {
                Message.error({message: "访问的资源不存在"})
            } else {
                if (success.data.message) {
                    Message.error({message: success.data.message})
                } else {
                    Message.error({message: "操作失败"})
                }
            }
        }

    }
}, error => {
    console.log("error", error);

    // 接口响应失败
    // let responseCode = error.response.code;
    // if (responseCode === 504) {
    //     Message.error({message: "服务器出小差了，稍后再试~"})
    // } else if (responseCode === 404) {
    //     Message.error({message: "访问资源不存在"})
    // } else if (responseCode === 403) {
    //     Message.error({message: "权限不足，请联系管理员"})
    // } else if (responseCode === 401) {
    //     Message.error({message: "尚未登录，请登录"})
    //     router.replace("/");
    // } else {
    //     if (error.response.data.message) {
    //         Message.error({message: error.response.data.message})
    //     } else {
    //         Message.error({message: "服务器错误"})
    //     }
    // }
})

// export get api
export const get = (url, params, config) => {
    if (params && params.resubmit) {
        let headersItem = { resubmit: params.resubmit }
        delete params.resubmit
        return new Promise((resolve, reject) => {
            instance({
                method: 'get',
                url: url,
                params: params,
                timeout: httpConfig(timeout, headersItem).timeout,
                headers: httpConfig(timeout, headersItem).headers
            }).then(response => {
                resolve(response)
            }).catch(err => {
                reject(err)
            })
        })
    } else {
        return new Promise((resolve, reject) => {
            instance({
                method: 'get',
                url: url,
                params: params,
                timeout: httpConfig(config).timeout,
                headers: httpConfig(config).headers
            }).then(response => {
                resolve(response)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

// export post api
export const post = (url, params, config) => {
    if (params && params.resubmit) {
        const headersItem = { resubmit: params.resubmit }
        delete params.resubmit
        return new Promise((resolve, reject) => {
            instance({
                method: 'post',
                url: url,
                timeout: httpConfig(timeout, headersItem).timeout,
                headers: httpConfig(timeout, headersItem).headers,
                data: params
            }).then(response => {
                resolve(response)
            }).catch(err => {
                reject(err)
            })
        })
    } else {
        return new Promise((resolve, reject) => {
            instance({
                method: 'post',
                url: url,
                timeout: httpConfig(config).timeout,
                headers: httpConfig(config).headers,
                data: params
            }).then(response => {
                resolve(response)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

export default {
    httpRequest() {
        return {
            get,
            post
        }
    }
}
