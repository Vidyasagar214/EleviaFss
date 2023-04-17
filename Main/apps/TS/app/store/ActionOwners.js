/**
 * Created by steve.tess on 2/22/2017.
 */
Ext.define('TS.store.ActionOwners', {
    extend: 'Ext.data.Store',

    storeId: 'ActionOwners',
    //buffered: true,

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
        property: 'flags',
        value: 'A'
    }]
});