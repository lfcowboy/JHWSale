/**
 * Created by fenglv on 2015/7/19.
 */
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes');
var ejs = require('ejs');
var path = require('path');
var mongoose = require('mongoose');
var user = require('./app-server/model/User');
var quotation = require('./app-server/model/Quotation');
var pool = require("./app-server/app-pooling");
app = express();
app.use(express.static(path.join(__dirname, 'app-client')));
app.listen(8070);
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

pool.iniPool();
routes(app);
