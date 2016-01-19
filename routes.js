/**
 * Created by fenglv on 2015/7/19.
 */
var index = require('./app-server/index');
var user = require('./app-server/user');
var quote = require("./app-server/quote");
var customer = require('./app-server/customer');
var chip = require('./app-server/chip');
var role = require('./app-server/server_role');
var section = require('./app-server/server_group');

module.exports = function (app) {
    app.get('/*', index.loginFilter);
    app.get('/', index.index);
    app.post('/showQuoteListPanel', quote.showQuoteListPanel);
    app.post('/showPriceListPanel', quote.showPriceListPanel);
    app.post('/showPrintQuotePanel', quote.showPrintQuotePanel);
    app.post('/showPanel_setRole',role.showSetRolePanel);
    app.post('/showPanel_setGroup', section.showSetGroupPanel);
    app.post('/showPanel_setSectionUser', section.showSetSectionUserPanel);
    app.post('/showPanel_setSectionRoleUser', section.showSetSectionRoleUserPanel);

    //section
    app.get('/getSectionUsers', section.getSectionUsers);
    app.get('/getSectionRoleUsers', section.getSectionUsers);
    app.get('/getSectionRoleUsersDiv', section.getSectionRoleUsersDiv);
    app.post('/addSectionRoleUser', section.addSectionRoleUser);
    app.post('/deleteSectionRoleUser', section.deleteSectionRoleUser);
    app.post('/addSectionUser', section.addSectionUser);
    app.post('/deleteSectionUser', section.deleteSectionUser);

    //role
    app.get('/getRoles', role.getRoles);
    app.get('/getActions', role.getActions);
    app.post('/addRole', role.addRole);

    //user
    app.get('/getUsers', user.getUsers);
    app.get('/getUserActionSection', user.getUserActionSection);

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
    app.get('/getCompany', customer.getCompany);
    app.post("/addQuote", quote.addQuote);
    app.get('/loadLogin', user.loadLogin);
    app.post('/doLogin', user.doLogin);
    app.get('/doLogout', user.doLogout);
    app.get("/getNewQuoteNum", quote.getNewQuoteNum);
    app.post("/addUser", user.addUser);
    app.post("/addGroup", section.addDepart);
};