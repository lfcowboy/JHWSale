/**
 * Created by fenglv on 2015/7/19.
 */
var path = require('path');
exports.index = function (req, res) {
    res.render('index',{'userName':'周芸丽'});
};