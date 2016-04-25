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
    app.get('/showPanel_quoteList', quote.showQuoteListPanel);
    app.get('/showPanel_myQuoteList', quote.showQuoteListPanel);
    app.get('/showPanel_priceListReport', quote.showPriceListReportPanel);
    app.post('/showPrintQuotePanel', quote.showPrintQuotePanel);
    app.get('/showPanel_setGroup', section.showSetGroupPanel);
    app.get('/showPanel_userList', user.showUserListPanel);
    app.get('/showPanel_sectionList', section.showSectionListPanel);
    app.get('/showPanel_roleList', role.showRoleListPanel);
    app.get('/showPanel_roleActions', role.showRoleActionsPanel);
    app.get('/showPanel_setSectionFrame', section.showSetSectionFramePanel);
    app.get('/showPanel_companyList', customer.showCompanyListPanel);
    app.get('/showPanel_customerList', customer.showCustomerListPanel);
    app.get('/showPanel_addQuote', quote.showAddQuotePanel);
    app.get('/showPanel_editPriceList', quote.showEditPriceListPanel);
    app.get('/showPanel_addCompany', customer.showAddCompanyPanel);
    app.get('/showPanel_addCustomer', customer.showAddCustomerPanel);

    app.get('/showPanel_addUser', user.showAddUserDialog);
    app.get('/showPanel_editUser', user.showEditUserDialog);
    app.get('/showPanel_addRole', role.showAddRoleDialog);
    app.get('/showPanel_addSection', section.showAddSectionDialog);

    //section
    app.get('/getSections', section.getSections);
    app.get('/getSectionUsers', section.getSectionUsers);
    app.get('/getSectionRoleUsers', section.getSectionUsers);
    app.get('/getSetSectionUserDiv', section.getSetSectionUserDiv);
    app.get('/getSetSectionRoleDiv', section.getSetSectionRoleDiv);
    app.get('/getSectionRoleDiv', section.getSectionRoleDiv);
    app.get('/getSectionRoleUserDiv', section.getSectionRoleUserDiv);
    app.get('/getSectionRoleUsersDiv', section.getSectionRoleUsersDiv);
    app.post('/addSectionRoleUser', section.addSectionRoleUser);
    app.post('/deleteSectionRoleUser', section.deleteSectionRoleUser);
    app.post('/addSectionUser', section.addSectionUser);
    app.post('/deleteSectionUser', section.deleteSectionUser);
    app.post('/addSectionRole', section.addSectionRole);
    app.post('/deleteSectionRole', section.deleteSectionRole);

    //role
    app.get('/getRoles', role.getRoles);
    app.get('/getActions', role.getActions);
    app.get('/getAllActionsByRoleId', role.getAllActionsByRoleId);
    app.post('/addRole', role.addRole);
    app.post('/updateRole', role.updateRole);

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
    app.post("/addQuote", quote.addQuote);
    app.post("/updateQuote", quote.updateQuote);
    app.get('/loadLogin', user.loadLogin);
    app.post('/doLogin', user.doLogin);
    app.get('/doLogout', user.doLogout);
    app.get("/getNewQuoteNum", quote.getNewQuoteNum);
    app.post("/addUser", user.addUser);
    app.post('/updateUser', user.updateUser);
    app.post("/addSection", section.addSection);
    app.post('/updateSection', section.updateSection)

    //customer
    app.post('/addCustomer',customer.addCustomer);
    app.post('/getCustomer', customer.getCustomerByCompanyId);
    app.post('/addCompany', customer.addCompany);
    app.get('/getCompany', customer.getCompany);
    app.get('/getCompanys', customer.getCompanys);
    app.get('/getCustomers', customer.getCustomers);
};