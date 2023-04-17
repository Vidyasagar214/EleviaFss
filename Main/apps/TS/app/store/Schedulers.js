/**
 * Created by steve.tess on 1/11/2017.
 */
Ext.define('TS.store.Schedulers', {
    extend: 'Ext.data.Store',

    storeId: 'Schedulers',

    model: 'TS.model.shared.Employee',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000,
    proxy: {
        type: 'default',
        directFn: 'Employee.GetAll',
        paramOrder: 'dbi|username'
    },
    remoteFilter: false,
    filters: [{
        property: 'isScheduler',
        value: true
    }]
});