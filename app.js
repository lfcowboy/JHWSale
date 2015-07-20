/**
 * Created by fenglv on 2015/7/19.
 */
var express = require('express');
var routes = require('./routes/routes');
var ejs = require('ejs');
var path = require('path');
app = express();
app.use(express.static( path.join(__dirname,'app-client') ));
app.listen(8080);
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.set('views',path.join(__dirname ,'views'));

routes(app);