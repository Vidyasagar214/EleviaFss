/**
 * Created by steve.tess on 2/22/2017.
 */
Ext.define('TS.store.FwaStatus', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    settingsDependency: true, //custom property
    storeId: 'FwaStatus',

    fields: ['value', 'description'],
    data: [
        {"value": "C", "description": "Creating"},
        {"value": "D", "description": "Scheduled"},
        {"value": "I", "description": "In Progress"},
        {"value": "V", "description": "Saved"},
        {"value": "S", "description": "Submitted"},
        {"value": "A", "description": "Approved"},
        {"value": "X", "description": "Removed"},
        {"value": "R", "description": "Rejected"} //used in expenses
    ]
});