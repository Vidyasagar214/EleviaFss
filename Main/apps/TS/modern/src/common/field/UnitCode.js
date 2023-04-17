/**
 * Created by steve.tess on 11/30/2016.
 */
Ext.define('TS.common.field.UnitCode', {
    extend: 'Ext.field.Select',
    xtype: 'field-unitcode',

    requires: [
        'TS.store.UnitCode'
    ],

    config: {
        valueField: 'unitCodeId',
        displayField: 'unitCodeCombo',
        store: 'UnitCode'
    }


});