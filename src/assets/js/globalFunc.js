exports.install = function (Vue) {
    Vue.prototype.check = function (str, msg) {
        if (str == undefined || str == null || str == '') {
            this.$message.error(msg);
            return false;
        }
        return true;
    };
    Vue.prototype.nowTime = function () {
        let date = new Date();
        var year = date.getFullYear(),
            month = date.getMonth() + 1,//月份是从0开始的
            day = date.getDate(),
            hour = date.getHours(),
            min = date.getMinutes(),
            sec = date.getSeconds();

        var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
            return '0' + index;
        });////开个长度为10的数组 格式为 00 01 02 03

        var newTime = year + '-' +
            (preArr[month] || month) + '-' +
            (preArr[day] || day) + ' ' +
            (preArr[hour] || hour) + ':' +
            (preArr[min] || min) + ':' +
            (preArr[sec] || sec);
        return newTime;
    };
    Vue.prototype.goTo = function (to) {
        this.$router.push(to);
    };
};