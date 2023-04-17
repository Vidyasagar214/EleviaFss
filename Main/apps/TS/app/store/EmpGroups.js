/**
 * Created by steve.tess on 6/15/2016.
 */
Ext.define('TS.store.EmpGroups', {
    extend: 'Ext.data.Store',

    alias: 'store.EmpGroups',

    storeId: 'EmpGroups',

    model: 'TS.model.shared.EmpGroup',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000,
    proxy: {
        type: 'default',
        directFn: 'EmpGroup.GetList',
        paramOrder: 'dbi|username'
    }
});