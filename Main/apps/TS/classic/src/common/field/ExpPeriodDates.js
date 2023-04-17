/**
 * Created by steve.tess on 7/30/2018.
 */
Ext.define('TS.common.field.ExpPeriodDates', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'field-expenseperioddates',

    valueField: 'value',
    displayField: 'formattedDate',
    matchFieldWidth: false,
    queryMode: 'local',

    tpl: '<tpl for="."><div class="x-boundlist-item">{formattedDate}</div></tpl>',
    displayTpl: '<tpl for=".">{formattedDate}</tpl>',

    store: 'ExpPeriodDates',

    listeners: {
        //this forces the dropdown open on focus
        focus: function (t) {
            t.expand();
        }
    }
});