/*
 * Holidays Store
 * GLOBAL / SINGLE INSTANCE STORE
 * This uses the active employee ID to populate a list of holidays per their holiday schedule
 */

Ext.define('TS.store.Holidays', {
    extend: 'Ext.data.Store',

    storeId: 'Holidays',

    model: 'TS.model.shared.Holiday',
    autoLoad: false,
    pageSize: 100000,
    proxy: {
        type: 'default',
        directFn: 'Holiday.GetListByEmployee',
        paramOrder: 'dbi|username|start|limit|empId'
    }
});
