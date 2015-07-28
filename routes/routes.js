/**
 * Created by fenglv on 2015/7/19.
 */
var index = require('./index');
var user = require('./user');
module.exports = function (app) {
    app.post('/login', user.doLogin);
    app.get('/', index.index);
};