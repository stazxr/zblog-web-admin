import api from './custom-axios'

const http = {
    login: params => {
        return api.httpRequest().post(
            `${serverConfig.BASE_URL}/api/process`, params
        )
    }
}

export default http
