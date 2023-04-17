/**
 * Created by SteveTess on 4/25/2022.
 */
Ext.define('TS.store.WeekdayByIndex', {
    extend: 'Ext.data.Store',

    autoLoad: false,
    settingsDependency: true, //custom property
    storeId: 'WeekdayByIndex',

    fields: ['value', 'description'],
    data: [
        {"value": 0, "description": "Sunday"},
        {"value": 1, "description": "Monday"},
        {"value": 2, "description": "Tuesday"},
        {"value": 3, "description": "Wednesday"},
        {"value": 4, "description": "Thursday"},
        {"value": 5, "description": "Friday"},
        {"value": 6, "description": "Saturday"}
    ]
});