/**
 * Created by fenglv on 2015/7/19.
 */
var index = require('./app-server/index');
var user = require('./app-server/user');
var quote = require("./app-server/quote");
var customer = require('./app-server/customer');

module.exports = function (app) {
    app.post('/addCustomer',customer.addCustomer);
    app.post('/getCustomer', customer.getCustomerByCompanyId);
    app.post('/addCompany', customer.addCompany);
    app.post('/getCompany', customer.getCompany);
    app.post("/addQuote", quote.addQuote);
    app.post('/login', user.doLogin);
    app.get("/getNewQuoteNum",quote.getNewQuoteNum);
    app.get('/', index.index);
};