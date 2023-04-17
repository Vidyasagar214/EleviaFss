/**
 * Created by steve.tess on 2/22/2017.
 */
Ext.define('TS.common.field.ActionOwners', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-actionowners',

    valueField: 'empId',
    displayField: 'lname',
    matchFieldWidth: false,
    queryMode: 'local',
    listConfig: {
        width: 195
    },

    tpl: '<tpl for="."><div class="x-boundlist-item">{lname}, {fname}</div></tpl>',
    displayTpl: '<tpl for=".">{lname}, {fname}</tpl>',

    store: 'ActionOwners'
});