/*
 * Roles Store
 * GLOBAL / SINGLE INSTANCE STORE
 */

Ext.define('TS.store.Roles', {
    extend: 'Ext.data.Store',

    storeId: 'Roles',

    model: 'TS.model.shared.CrewRole',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000
});
