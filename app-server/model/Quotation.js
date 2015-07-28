/**
 * Created by fenglv on 2015/7/20.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define Quotation schema
var _Quotation = new Schema({
    email : String,
    name : String,
    salt : String,
    password : String
});

// export them
exports.Quotation = mongoose.model('Quotation', _Quotation);