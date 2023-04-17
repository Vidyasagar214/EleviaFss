/**
 * Created by steve.tess on 7/9/2018.
 */
Ext.define('TS.store.ExpCategory', {
    extend: 'Ext.data.Store',

    storeId: 'ExpCategory',

    model: 'TS.model.shared.ExpCategory',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000
});