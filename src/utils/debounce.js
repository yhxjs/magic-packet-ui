export default function debounce(fn, delay = 1000, immediate = false, noticeFunc, resultCb) {
    // 实现防抖函数的核心是使用setTimeout
    // time变量用于保存setTimeout返回的Id
    let time = null
    // isImmediateInvoke变量用来记录是否立即执行, 默认为false
    let isImmediateInvoke = false

    // 将回调接收的参数保存到args数组中
    function _debounce(...args) {
        // 如果time不为0，也就是说有定时器存在，将该定时器清除
        if (time) {
            clearTimeout(time)
            if (typeof noticeFunc === 'function' && isImmediateInvoke) {
                noticeFunc()
            }
        }

        // 当是第一次触发，并且需要触发第一次事件
        if (!isImmediateInvoke && immediate) {
            // 将函数的返回值保存到result中
            const result = fn.apply(this, args)
            if (typeof resultCb === 'function') {
                // 当用户传递了resultCb函数时，执行该函数，并将结果以参数传递出去。
                resultCb(result)
            }
            // 将isImmediateInvoke设置为true，这样不会影响到后面频繁触发的函数调用
            isImmediateInvoke = true
        }

        time = setTimeout(() => {
            // 使用apply改变fn的this，同时将参数传递给fn
            // fn.apply(this, args)
            // 当定时器里的函数执行时，也就是说是频繁触发事件的最后一次事件
            // 将isImmediateInvoke设置为false，这样下一次的第一次触发事件才能被立即执行
            isImmediateInvoke = false
        }, delay)
    }

    // 防抖函数会返回另一个函数，该函数才是真正被调用的函数
    return _debounce
}
