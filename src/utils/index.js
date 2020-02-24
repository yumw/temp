/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTimeAgo(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

// 获取当月最后一天日期
function getLastDay(year, month) {
  var new_year = year // 取当前的年份
  var new_month = month++ // 取下一个月的第一天，方便计算（最后一天不固定）
  if (month > 12) {
    new_month -= 12 // 月份减
    new_year++ // 年份增
  }
  var new_date = new Date(new_year, new_month, 1) // 取当年当月中的第一天
  return new Date(new_date.getTime() - 1000 * 60 * 60 * 24) // 获取当月最后一天日期
}

/**
 * @param {Date} beginTime
 * @param {Date} endTime
 * @return {boolean}
 * @export
 */
export function hasCalendarMonth(beginTime, endTime) {
  const lastDay = getLastDay(beginTime.getFullYear(), beginTime.getMonth())
  const nextMonthLastDay = getLastDay(beginTime.getFullYear(), beginTime.getMonth() + 1)
  if (endTime.getTime() >= nextMonthLastDay.getTime() || (beginTime.getDate() === 1 && endTime.getTime() >= lastDay.getTime())) {
    return true
  }
  return false
}

/**
 * @param {Date} beginTime
 * @param {Date} endTime
 * @return {boolean}
 * @export
 */
export function hasCalendarWeek(beginTime, endTime) {
  const day = beginTime.getDay()
  const time1 = (7 - day) * 1000 * 60 * 60 * 24 + beginTime.getTime()
  const time2 = (14 - day) * 1000 * 60 * 60 * 24 + beginTime.getTime()
  if (endTime.getTime() >= time2 || (day === 0 || day === 1) && endTime.getTime() >= time1) {
    return true
  }
  return false
}

export function deepCopy(obj) {
  // 只拷贝对象
  if (typeof obj !== 'object') return
  // 根据obj的类型判断是新建一个数组还是一个对象
  var newObj = obj instanceof Array ? [] : {}
  for (var key in obj) {
    // 遍历obj,并且判断是obj的属性才拷贝
    if (obj.hasOwnProperty(key)) {
      // 判断属性值的类型，如果是对象递归调用深拷贝
      newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key]
    }
  }
  return newObj
}

/**
 * @param {Date} time
 * @return {Number} nuix
 * @export
 */
export function timeToUnix(time) {
  return new Date(time).getTime();
}





export function formatTime(date,fmt = 'yyyy-MM-dd HH:mm:ss') {
  var date = new Date(date)
  var o = {
      "M+": date.getMonth() + 1, //月份 
      "d+": date.getDate(), //日 
      "H+": date.getHours(), //小时 
      "m+": date.getMinutes(), //分 
      "s+": date.getSeconds(), //秒 
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
      "S": date.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

