Ext.define('TS.common.field.UdfList1', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-udfList1',

    valueField: 'udfName',
    displayField: 'udfName',
    matchFieldWidth: false,
    queryMode: 'local',
    // listConfig: {
    //     width: 195
    // },

    tpl: '<tpl for="."><div class="x-boundlist-item">{udfName}</div></tpl>',
    displayTpl: '<tpl for=".">{udfName}</tpl>',

    store: 'UdfList1'
});