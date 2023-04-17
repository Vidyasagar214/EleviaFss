/**
 * Created by steve.tess on 4/21/2017.
 */
Ext.define('TS.store.AddlDates', {
    extend: 'Ext.data.Store',

    requires: [
        'TS.model.shared.Dates'
    ],

    storeId: 'AddlDates',

    model: 'TS.model.shared.Dates',
    autoLoad: true,
    settingsDependency: true, //custom property
    pageSize: 100000

});