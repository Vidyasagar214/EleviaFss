/*
 * LaborCodetore
 * GLOBAL / SINGLE INSTANCE STORE
 */

Ext.define('TS.store.LaborCodes', {
    extend: 'Ext.data.Store',

    storeId: 'LaborCodes',

    model: 'TS.model.shared.LaborCode',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000
});
