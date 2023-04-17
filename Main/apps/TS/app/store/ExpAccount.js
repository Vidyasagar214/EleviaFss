/**
 * Created by steve.tess on 8/3/2018.
 */
Ext.define('TS.store.ExpAccount', {
    extend: 'Ext.data.Store',
    storeId: 'ExpAccount',

    model: 'TS.model.shared.ExpAccount',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000
});