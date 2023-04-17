/**
 * Created by steve.tess on 9/4/2016.
 */
Ext.define('TS.store.ActionItem', {
    extend: 'Ext.data.Store',

    storeId: 'ActionItem',

    model: 'TS.model.shared.ActionItem',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000,

    filters: ( [{property: 'actionItemStatus', value: 'A'}] )

});