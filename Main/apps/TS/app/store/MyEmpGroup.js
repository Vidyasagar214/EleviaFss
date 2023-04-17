/**
 * Created by steve.tess on 7/11/2016.
 */
Ext.define('TS.store.MyEmpGroup', {
    extend: 'Ext.data.Store',
    alias: 'store.MyEmpGroup',

    storeId: 'MyEmpGroup',

    model: 'TS.model.shared.EmpGroup',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000,
    proxy: {
        type: 'default',
        directFn: 'EmpGroup.Get',
        paramOrder: 'dbi|username|empGroupId'
    }
});