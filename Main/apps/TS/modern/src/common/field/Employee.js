Ext.define('TS.common.field.Employee', {
    extend: 'Ext.field.Select',
    xtype: 'field-employee',
    autoSelect: false,

    config: {
        valueField: 'empId',
        displayField: 'empName',

        //TODO x-boundlist-item is not supported in Modern, find a workaround
        //tpl: '<tpl for="."><div class="x-boundlist-item">{Fname} {Lname}</div></tpl>',
        //TODO displayTpl is not supported in Modern, find a workaround
        //displayTpl: '<tpl for=".">{Fname} {Lname}</tpl>',

        store: 'Employees'
    }
});