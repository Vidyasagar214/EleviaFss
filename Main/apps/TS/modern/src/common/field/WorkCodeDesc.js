Ext.define('TS.common.field.WorkCodeDesc', {
    extend: 'Ext.field.Select',
    xtype: 'field-workcodedesc',

    config: {
        valueField: 'workCodeAbbrev',
        displayField: 'workCodeDescr',
        store: {
            model: 'TS.model.shared.WorkCode',
            autoLoad: true,
            limit: 1000
        }
    }
});