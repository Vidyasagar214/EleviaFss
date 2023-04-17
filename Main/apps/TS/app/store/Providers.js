/**
 * Created by steve.tess on 3/5/2018.
 */
Ext.define('TS.store.Providers', {
    extend: 'Ext.data.Store',

    autoLoad: false,
    settingsDependency: true, //custom property
    storeId: 'Providers',

    fields: ['value', 'description'],
    data:[

        {"value": "@txt.att.net", "description": "AT&T"},
        {"value": "@myboostmobile.com", "description": "Boost Mobile"},
        {"value": "@sms.mycricket.com", "description": "Cricket"},
        {"value": "@messaging.sprintpcs.com", "description": "Sprint"},
        {"value": "@tmomail.net", "description": "T-Mobile"},
        {"value": "@email.uscc.net", "description": "US Cellular"},
        {"value": "@vtext.com", "description": "Verizon"},
        {"value": "@vmobl.com", "description": "Virgin Mobile"}
    ]
});
