Ext.define('TS.common.field.Employee', {

    extend: 'Ext.form.field.ComboBox',
    xtype: 'field-employee',
   
    valueField: 'empId',
    displayField: 'lname',
    matchFieldWidth: false,
    queryMode: 'local',

    tpl: '<tpl for="."><div class="x-boundlist-item">{lname}, {fname}</div></tpl>',
    displayTpl: '<tpl for=".">{lname}, {fname}</tpl>',

    store: 'Employees',

    listeners: {
        //this forces the dropdown open on focus
        focus: function (t) {
            t.expand();
        }
    }
});
