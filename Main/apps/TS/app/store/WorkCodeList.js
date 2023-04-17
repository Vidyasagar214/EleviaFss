/**
 * Created by steve.tess on 9/27/2016.
 */
Ext.define('TS.store.WorkCodeList', {
    extend: 'Ext.data.Store',

    storeId: 'WorkCodeList',

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

