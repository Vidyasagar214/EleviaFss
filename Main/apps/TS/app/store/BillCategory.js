/**
 * Created by steve.tess on 9/30/2016.
 */
Ext.define('TS.store.BillCategory', {
    extend: 'Ext.data.Store',

    storeId: 'BillCategory',

    model: 'TS.model.shared.BillCategory',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000

});