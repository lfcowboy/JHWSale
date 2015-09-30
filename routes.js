/**
 * Created by fenglv on 2015/7/19.
 */
var index = require('./app-server/index');
var user = require('./app-server/user');
var quote = require("./app-server/quote");
var customer = require('./app-server/customer');
var product = require('./app-server/product');

module.exports = function (app) {
    app.post('/getPriceTable', quote.getPriceTablePanel);


    app.get('/getPrice', quote.getPrice);
    app.get('/getPriceByQuoteId', quote.getPriceByQuoteId);
    app.post('/addPrice', quote.addPrice);
    app.post('/deletePrice', quote.deletePrice);
    app.post('/updatePrice', quote.updatePrice);
    app.get('/getProduct', product.getProduct);
    app.post('/addProduct',product.addProduct);
    app.get('/getDefaultRemarks', quote.getDefaultRemarks);
    app.post('/addCustomer',customer.addCustomer);
    app.post('/getCustomer', customer.getCustomerByCompanyId);
    app.post('/addCompany', customer.addCompany);
    app.post('/getCompany', customer.getCompany);
    app.post("/addQuote", quote.addQuote);
    app.post('/login', user.login);
    app.get("/getNewQuoteNum",quote.getNewQuoteNum);
    app.get('/', index.index);
};