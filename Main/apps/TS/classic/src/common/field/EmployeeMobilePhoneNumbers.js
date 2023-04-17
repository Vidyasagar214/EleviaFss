/**
 * Created by steve.tess on 3/5/2018.
 */
Ext.define('TS.common.field.EmployeeMobilePhoneNumbers', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-employeeMobilePhoneNumbers',

    valueField: 'mobilePhone',
    displayField: 'lname',
    matchFieldWidth: false,
    //editable: false,
    queryMode: 'local',
    listConfig:{
        width: 195
    },

    tpl: '<tpl for="."><div class="x-boundlist-item">{lname}, {fname}</div></tpl>',
    displayTpl: '<tpl for=".">{lname}, {fname}</tpl>',

    store: 'Employees'
});