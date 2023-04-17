/**
 * Created by steve.tess on 12/14/2016.
 */
Ext.define('TS.common.field.AllEmployees', {
    extend: 'Ext.field.Select',
    xtype: 'field-allemployees',
    autoSelect: false,

    config: {
        valueField: 'empId',
        displayField: 'empName',

        store: 'AllEmployees'
    }
});