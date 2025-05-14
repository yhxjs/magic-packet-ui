import request from '@/utils/request'

export default {
    send(id) {
        return request({
            url: '/wake/send',
            method: 'post',
            data: {
                id: id
            },
        })
    }
}