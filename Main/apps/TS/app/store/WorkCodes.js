/*
 * WorkCodes Store
 * GLOBAL / SINGLE INSTANCE STORE
 */

Ext.define('TS.store.WorkCodes', {
    extend: 'Ext.data.Store',

    storeId: 'WorkCodes',

    model: 'TS.model.shared.WorkCode',
    autoLoad: false,
    settingsDependency: true, //custom property
    pageSize: 100000,
    filters: ( [{property: 'workCodeStatus', value: 'A'}] ),
    sorters: [
        {
            property: 'workCodeAbbrev',
            direction: 'ASC'
        }
    ]
});
