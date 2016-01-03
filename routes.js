/**
 * Created by fenglv on 2015/7/19.
 */
var index = require('./app-server/index');
var user = require('./app-server/user');
var quote = require("./app-server/quote");
var customer = require('./app-server/customer');
var chip = require('./app-server/chip');

module.exports = function (app) {
    app.get('/*', index.loginFilter);
    app.get('/', index.index);
    app.post('/showQuoteListPanel', quote.showQuoteListPanel);
    app.post('/showPriceListPanel', quote.showPriceListPanel);
    app.post('/showPrintQuotePanel', quote.showPrintQuotePanel);
    app.get('/getQuote', quote.getQuote);
    app.post('/deleteQuote', quote.deleteQuote);
    app.get('/getPrice', quote.getPrice);
    app.get('/getPriceByQuoteId', quote.getPriceByQuoteId);
    app.post('/addPrice', quote.addPrice);
    app.post('/deletePrice', quote.deletePrice);
    app.post('/updatePrice', quote.updatePrice);
    app.get('/getChip', chip.getChip);
    app.post('/addChip',chip.addChip);
    app.get('/getPackage',chip.getPackage);
    app.get('/getDefaultRemarks', quote.getDefaultRemarks);
    app.post('/addCustomer',customer.addCustomer);
    app.post('/getCustomer', customer.getCustomerByCompanyId);
    app.post('/addCompany', customer.addCompany);
    app.post('/getCompany', customer.getCompany);
    app.post("/addQuote", quote.addQuote);
    app.get('/loadLogin', user.loadLogin);
    app.post('/doLogin', user.doLogin);
    app.get('/doLogout', user.doLogout);
    app.get("/getNewQuoteNum",quote.getNewQuoteNum);
};