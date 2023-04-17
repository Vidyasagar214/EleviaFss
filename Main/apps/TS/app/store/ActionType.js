/**
 * Created by steve.tess on 9/12/2016.
 */
Ext.define('TS.store.ActionType', {
    extend: 'Ext.data.Store',

    storeId: 'ActionType',

    model: 'TS.model.shared.ActionType',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000,

    filters: ( [{property: 'actionTypeStatus', value: 'A'}] )
});