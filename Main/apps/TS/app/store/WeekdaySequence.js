/**
 * Created by steve.tess on 1/27/2017.
 */
Ext.define('TS.store.WeekdaySequence', {
    extend: 'Ext.data.Store',

    autoLoad: false,
    settingsDependency: true, //custom property
    storeId: 'WeekdaySequence',

    fields: ['value', 'description'],
    data: [
        {"value": "SU", "description": "Sunday"},
        {"value": "MO", "description": "Monday"},
        {"value": "TU", "description": "Tuesday"},
        {"value": "WE", "description": "Wednesday"},
        {"value": "TH", "description": "Thursday"},
        {"value": "FR", "description": "Friday"},
        {"value": "SA", "description": "Saturday"}
    ]
});