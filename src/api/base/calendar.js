import api from './../custom-axios'

const http = {
    // 获取节假日或工作日列表
    listCalendarSet: params => {
        return api.httpRequest().get(
            `${serverConfig.BASE_URL}/api/calendar/listCalendarSet`, params
        )
    },
    // 节假日或工作日设置
    calendarSet: params => {
        return api.httpRequest().post(
            `${serverConfig.BASE_URL}/api/calendar/calendarSet`, params
        )
    },
    // 取消节假日或工作日设置
    cancelCalendarSet: params => {
        return api.httpRequest().post(
            `${serverConfig.BASE_URL}/api/calendar/cancelCalendarSet`, params
        )
    },
    // 导出节假日或工作日设置
    exportCalendarSet: params => {
        return api.httpRequest().post(
            `${serverConfig.BASE_URL}/api/calendar/exportCalendarSet`, params, {
                'Content-Type': 'blob'
            }, {responseType: 'arraybuffer'}
        )
    },
    // 导入节假日或工作日设置
    importCalendarSet: params => {
        return api.httpRequest().post(
            `${serverConfig.BASE_URL}/api/calendar/importCalendarSet`, params
        )
    }
}

export default http
