/**
 * Created by steve.tess on 2/3/2016.
 */
Ext.define('TS.store.AllEmployees', {
    extend: 'Ext.data.Store',

    storeId: 'AllEmployees',
    //buffered: true,

    model: 'TS.model.shared.Employee',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000,
    proxy: {
        type: 'default',
        directFn: 'Employee.GetAll',
        paramOrder: 'dbi|username'
    }
});
