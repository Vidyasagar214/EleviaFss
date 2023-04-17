/**
 * Created by steve.tess on 7/30/2018.
 */
Ext.define('TS.common.field.ExpPeriodDates', {
    extend: 'Ext.field.Select',
    xtype: 'field-expperioddates',
    autoSelect: false,

    config: {
        valueField: 'value',
        displayField: 'value',
        store: 'ExpPeriodDates'
    }
});