/**
 * Created by steve.tess on 1/27/2017.
 */
Ext.define('TS.store.DaySequence', {
    extend: 'Ext.data.Store',

    autoLoad: false,
    settingsDependency: true, //custom property
    storeId: 'DaySequence',

    fields: ['value', 'description'],
    data: [
        {"value": 1, "description": "first"},
        {"value": 2, "description": "second"},
        {"value": 3, "description": "third"},
        {"value": 4, "description": "fourth"}
    ]
});