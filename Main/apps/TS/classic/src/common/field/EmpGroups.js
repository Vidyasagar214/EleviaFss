/**
 * Created by steve.tess on 4/18/2017.
 */
Ext.define('TS.common.field.EmpGroups', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-employeegroup',
    // requires: ['TS.model.shared.Employee'],

    valueField: 'empGroupId',
    displayField: 'empGroupName',
    matchFieldWidth: false,
    queryMode: 'local',
    listConfig:{
        width: 195
    },

    tpl: '<tpl for="."><div class="x-boundlist-item">{empGroupName}</div></tpl>',
    displayTpl: '<tpl for=".">{empGroupName}</tpl>',

    store: 'EmpGroups'
});