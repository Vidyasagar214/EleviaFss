/*
 * WorkCodes Store
 * GLOBAL / SINGLE INSTANCE STORE
 */

Ext.define('TS.store.Clients', {
    extend: 'Ext.data.Store',

    storeId: 'Clients',

    model: 'TS.model.shared.Client',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000,
    proxy: {
        type: 'default',
        directFn: 'Client.GetList',
        paramOrder: 'dbi|username|start|limit|includeInactive'
    }
});
