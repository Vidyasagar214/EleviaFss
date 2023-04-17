
Ext.define('TS.common.field.Template', {
    extend: 'Ext.field.Select',

    xtype: 'field-template',

    requires: [
        'TS.model.shared.PrintTemplate'
    ],

    valueField: 'templateId',
    displayField: 'templateName',

    store: {
        model: 'TS.model.shared.PrintTemplate',
        autoLoad: true,
        pageSize: 10000,
        remoteFilter: false,
        remoteSort: false
    }
});