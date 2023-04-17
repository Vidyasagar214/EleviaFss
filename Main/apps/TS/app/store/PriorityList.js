/**
 * Created by steve.tess on 8/29/2016.
 */
Ext.define('TS.store.PriorityList', {
    extend: 'Ext.data.Store',

    storeId: 'PriorityList',

    model: 'TS.model.shared.Priority',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000
});