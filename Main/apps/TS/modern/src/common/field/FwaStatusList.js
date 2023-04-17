/**
 * Created by steve.tess on 5/18/2017.
 */
Ext.define('TS.common.field.FwaStatusList', {
    extend: 'Ext.field.Select',
    xtype: 'field-fwastatuslist',

    config: {
        valueField: 'value',
        displayField: 'description',
        store: 'FwaStatus'
    }
});