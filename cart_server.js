'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var async = require('async');
var mongoose = require('mongoose');
var connString = 'mongodb://127.0.0.1/cart';//
var db = mongoose.connect(connString);
require('./models/cart_model.js')(mongoose);
var app = express();
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/build');
app.set('view engine', 'html');
app.use(bodyParser());
require('./cart_routes')(app);
app.listen(83);


var myCon = (require('./js/my-connector.js'))(mongoose, connString) ;

var myConn =   myCon.getInstance();

require('./js/hosonto_server')(app, myConn);

global.BL =  require('./static/js/business_logic.js');//(myConn);
BL(myConn);



