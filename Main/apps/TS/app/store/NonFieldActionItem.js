/**
 * Created by steve.tess on 9/21/2016.
 */
Ext.define('TS.store.NonFieldActionItem', {
    extend: 'Ext.data.Store',

    storeId: 'NonFieldActionItem',

    model: 'TS.model.shared.NonFieldActionItem',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000,

    filters: ( [{property: 'actionItemStatus', value: 'A'}] )
});