/*
 * WorkCodes Store
 * GLOBAL / SINGLE INSTANCE STORE
 */

Ext.define('TS.store.Employees', {
    extend: 'Ext.data.Store',

    alias: 'store.Employees',

    storeId: 'Employees',

    model: 'TS.model.shared.Employee',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000,
    sorters: [{
        property: 'lname',
        direction: 'ASC'
    }],
    proxy: {
        type: 'default',
        directFn: 'Employee.GetList',
        paramOrder: 'dbi|username|start|limit|includeInactive|fwaEmployeesOnly',
        extraParams: {
            includeInactive: false,
            fwaEmployeesOnly: true
        }
    }
});
