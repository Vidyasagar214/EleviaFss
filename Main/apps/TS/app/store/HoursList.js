/**
 * Created by steve.tess on 3/20/2017.
 */
Ext.define('TS.store.HoursList', {
    extend: 'Ext.data.Store',

    requires: [
        'TS.model.shared.Hours'
    ],

    autoLoad: false,
    settingsDependency: true, //custom property
    storeId: 'HoursList',
    model: 'TS.model.shared.Hours',

    fields: ['value', 'description'],

    data: [
        {"value": "1900-01-01T00:00:00", "description": "12:00 AM"},
        {"value": "1900-01-01T01:00:00", "description": "1:00 AM"},
        {"value": "1900-01-01T02:00:00", "description": "2:00 AM"},
        {"value": "1900-01-01T03:00:00", "description": "3:00 AM"},
        {"value": "1900-01-01T04:00:00", "description": "4:00 AM"},
        {"value": "1900-01-01T05:00:00", "description": "5:00 AM"},
        {"value": "1900-01-01T06:00:00", "description": "6:00 AM"},
        {"value": "1900-01-01T07:00:00", "description": "7:00 AM"},
        {"value": "1900-01-01T08:00:00", "description": "8:00 AM"},
        {"value": "1900-01-01T09:00:00", "description": "9:00 AM"},
        {"value": "1900-01-01T10:00:00", "description": "10:00 AM"},
        {"value": "1900-01-01T11:00:00", "description": "11:00 AM"},
        {"value": "1900-01-01T12:00:00", "description": "12:00 PM"},
        {"value": "1900-01-01T13:00:00", "description": "1:00 PM"},
        {"value": "1900-01-01T14:00:00", "description": "2:00 PM"},
        {"value": "1900-01-01T15:00:00", "description": "3:00 PM"},
        {"value": "1900-01-01T16:00:00", "description": "4:00 PM"},
        {"value": "1900-01-01T17:00:00", "description": "5:00 PM"},
        {"value": "1900-01-01T18:00:00", "description": "6:00 PM"},
        {"value": "1900-01-01T19:00:00", "description": "7:00 PM"},
        {"value": "1900-01-01T20:00:00", "description": "8:00 PM"},
        {"value": "1900-01-01T21:00:00", "description": "9:00 PM"},
        {"value": "1900-01-01T22:00:00", "description": "10:00 PM"},
        {"value": "1900-01-01T23:00:00", "description": "11:00 PM"},
        {"value": "1900-01-01T23:59:00", "description": "11:59 PM"}
    ]
});