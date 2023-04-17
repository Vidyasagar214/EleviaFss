/**
 * Created by steve.tess on 10/25/2016.
 */
Ext.define('TS.common.field.TsEmployee', {

    extend: 'Ext.form.field.ComboBox',
    xtype: 'field-tsemployee',

    valueField: 'empId',
    displayField: 'lname',
    matchFieldWidth: false,
    queryMode: 'local',

    tpl: '<tpl for="."><div class="x-boundlist-item">{lname}, {fname}</div></tpl>',
    displayTpl: '<tpl for=".">{lname}, {fname}</tpl>',

    store: 'TsEmployees',

    listeners: {
        //this forces the dropdown open on focus
        focus: function (t) {
            t.expand();
        }
    }
});