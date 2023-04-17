Ext.define('TS.common.field.UdfList2', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-udfList2',

    valueField: 'udfName',
    displayField: 'udfName',
    matchFieldWidth: false,
    queryMode: 'local',
    // listConfig: {
    //     width: 195
    // },

    tpl: '<tpl for="."><div class="x-boundlist-item">{udfName}</div></tpl>',
    displayTpl: '<tpl for=".">{udfName}</tpl>',

    store: 'UdfList2'
});