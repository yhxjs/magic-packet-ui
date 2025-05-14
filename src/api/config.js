import request from '@/utils/request'

export default {
    getConfigList(pageNo, pageSize) {
        return request({
            url: '/config/query',
            method: 'post',
            data: {
                page: pageNo,
                size: pageSize
            },
        })
    },
    addConfig(config) {
        return request({
            url: '/config/add',
            method: 'post',
            data: {
                name: config.name,
                desc: config.desc,
                ip: config.ip,
                mask: config.mask,
                mac: config.mac,
                port: config.port
            },
        })
    },
    updateConfig(config) {
        return request({
            url: '/config/update',
            method: 'post',
            data: {
                id: config.id,
                name: config.name,
                desc: config.desc,
                ip: config.ip,
                mask: config.mask,
                mac: config.mac,
                port: config.port
            },
        })
    },
    deleteConfig(id) {
        return request({
            url: '/config/delete',
            method: 'post',
            data: {
                id: id
            },
        })
    }
}