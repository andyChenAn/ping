exports.parseRange = function (str , size) {
    if (str.indexOf(',') != -1) {
        return;
    };
    let range = str.split('-');
    let start = parseInt(range[0].match(/\d+/)[0]);
    let end = parseInt(range[1]);
    // 防止：200-这种情况
    if (isNaN(end)) {
        end = size - 1;
    };
    if (isNaN(start) || isNaN(end) || start > end || end > size) {
        return;
    }
    return {
        start : start,
        end : end
    }
};