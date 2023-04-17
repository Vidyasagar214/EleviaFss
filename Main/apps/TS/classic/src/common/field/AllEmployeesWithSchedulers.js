/**
 * Created by steve.tess on 3/28/2017.
 */
Ext.define('TS.common.field.AllEmployeesWithSchedulers', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-allemployeewithschedulers',
    // requires: ['TS.model.shared.Employee'],

    valueField: 'empId',
    displayField: 'lname',
    matchFieldWidth: false,
    //editable: false,
    queryMode: 'local',
    listConfig:{
        width: 195
    },

    tpl: '<tpl for="."><div class="x-boundlist-item">{lname}, {fname}</div></tpl>',
    displayTpl: '<tpl for=".">{lname}, {fname}</tpl>',

    store: 'AllEmployees'
});