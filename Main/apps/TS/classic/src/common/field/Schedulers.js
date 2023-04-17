/**
 * Created by steve.tess on 12/15/2016.
 */
Ext.define('TS.common.field.Schedulers', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-schedulers',

    valueField: 'empId',
    displayField: 'lname',
    matchFieldWidth: false,
    queryMode: 'local',
    listConfig: {
        width: 195
    },

    tpl: '<tpl for="."><div class="x-boundlist-item">{lname}, {fname}</div></tpl>',
    displayTpl: '<tpl for=".">{lname}, {fname}</tpl>',

    store: 'Schedulers'
});