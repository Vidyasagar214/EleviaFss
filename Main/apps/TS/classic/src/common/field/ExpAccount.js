/**
 * Created by steve.tess on 8/3/2018.
 */
Ext.define('TS.common.field.ExpAccount', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'field-expenseaccount',

    valueField: 'account',
    displayField: 'account',
    matchFieldWidth: false,
    queryMode: 'local',

    tpl: '<tpl for="."><div class="x-boundlist-item">{account} - {accountName}</div></tpl>',
    displayTpl: '<tpl for=".">{account}</tpl>',

    store: 'ExpAccount',

    listeners: {
        //this forces the dropdown open on focus
        focus: function (t) {
            t.expand();
        }
    }
});