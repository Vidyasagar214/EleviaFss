/**
 * Created by steve.tess on 10/25/2016.
 */
Ext.define('TS.store.TsEmployees', {
    extend: 'Ext.data.Store',

    alias: 'store.TsEmployees',

    storeId: 'TsEmployees',

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
            fwaEmployeesOnly: false //this will return all regardless of eg.FwaAvailableForFwaAssignment='Y'
        }
    }
});