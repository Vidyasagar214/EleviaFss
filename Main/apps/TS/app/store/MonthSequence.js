/**
 * Created by steve.tess on 1/31/2017.
 */
Ext.define('TS.store.MonthSequence', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    settingsDependency: true, //custom property
    storeId: 'MonthSequence',

    fields: ['value', 'description'],
    data: [
        {"value": "1", "description": "January"},
        {"value": "2", "description": "February"},
        {"value": "3", "description": "March"},
        {"value": "4", "description": "April"},
        {"value": "5", "description": "May"},
        {"value": "6", "description": "June"},
        {"value": "7", "description": "July"},
        {"value": "8", "description": "August"},
        {"value": "9", "description": "September"},
        {"value": "10", "description": "October"},
        {"value": "11", "description": "November"},
        {"value": "12", "description": "December"}
    ]
});