Ext.define('TS.common.field.Template', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-template',

    requires: [
        'TS.model.shared.PrintTemplate'
    ],

    valueField: 'templateId',
    displayField: 'templateName',
    typeAhead: false,
    autoSelect: true,

    store: {
        model: 'TS.model.shared.PrintTemplate',
        autoLoad: false,
        pageSize: 10000,
        remoteFilter: false,
        remoteSort: false
    }

});
