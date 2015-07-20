/**
 * Created by fenglv on 2015/7/19.
 */
var index = require('./index');
module.exports = function (app) {
    app.get('/', index.index);
};