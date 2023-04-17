Ext.define('TS.common.field.WorkCode', {
    extend: 'Ext.field.Select',
    xtype: 'field-workcode',

    config: {
        valueField: 'workCodeId',
        displayField: 'workCodeCombo',
        store: 'WorkCodes'
        // {
        //     model: 'TS.model.shared.WorkCode',
        //     autoLoad: true,
        //     limit: 1000
        // }
    }

});