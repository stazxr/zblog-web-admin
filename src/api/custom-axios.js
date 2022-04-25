import axios from "axios";
import httpConfig from './http-config'
import { Message } from 'element-ui';
import router from "@/router";

// create instance
const instance = axios.create();

// api timeout
const timeout = serverConfig.TIME_OUT;

// set response interceptor
instance.interceptors.response.use(response => {
    // deal response
    console.log("response", response);
    if (response.data) {
        const { code, message } = response.data
        const { responseType } = response.config
        if (responseType === 'blob') {
            // return response
            return response;
        }

        if (code === 200) {
            // success, return data
            return response.data;
        } else if (code === 401) {
            Message.error({message: message || "尚未登录，请登录"})
            router.replace("/").then(_ => {
                console.log("身份认证已过期，跳转登录页面")
            });
        } else if (code === 403) {
            Message.error({message: "权限不足，请联系管理员"})
        } else if (response.data.code === 404) {
            Message.error({message: "访问的资源不存在"})
        } else {
            Message.error({message: message || "系统发生未知错误"})
        }
        return Promise.reject(response)
    }
}, error => {
    console.log("error", error);
    if (error.response) {
        console.log("error.response", error.response);

        const { status, data: { message } } = error.response
        console.log("status", status);
        console.log("data.message", message);
    }

    return Promise.reject(error)
})

// export get api
export const get = (url, params, headersItem, respType) => {
    if (params && params.resubmit) {
        let headersItem = { resubmit: params.resubmit }
        delete params.resubmit
        let hc = httpConfig(timeout, headersItem);
        return new Promise((resolve, reject) => {
            instance({
                method: 'get',
                url: url,
                params: params,
                timeout: hc.timeout,
                headers: hc.headers,
                responseType: hc.responseType
            }).then(response => {
                resolve(response)
            }).catch(err => {
                reject(err)
            })
        })
    } else {
        return new Promise((resolve, reject) => {
            let hc = httpConfig(timeout, headersItem, respType);
            instance({
                method: 'get',
                url: url,
                params: params,
                timeout: hc.timeout,
                headers: hc.headers,
                responseType: hc.responseType
            }).then(response => {
                resolve(response)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

// export post api
export const post = (url, params, headersItem, respType) => {
    if (params && params.resubmit) {
        const headersItem = { resubmit: params.resubmit }
        delete params.resubmit
        let hc = httpConfig(timeout, headersItem);
        return new Promise((resolve, reject) => {
            instance({
                method: 'post',
                url: url,
                data: params,
                timeout: hc.timeout,
                headers: hc.headers,
                responseType: hc.responseType
            }).then(response => {
                resolve(response)
            }).catch(err => {
                reject(err)
            })
        })
    } else {
        return new Promise((resolve, reject) => {
            let hc = httpConfig(timeout, headersItem, respType);
            instance({
                method: 'post',
                url: url,
                timeout: hc.timeout,
                headers: hc.headers,
                responseType: hc.responseType,
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
