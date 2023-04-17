Ext.define('TS.common.field.BillCat', {

    extend: 'Ext.form.field.ComboBox',

    requires: ['TS.model.shared.BillCategory'],

    xtype: 'field-billcat',

    displayTpl: '<tpl for=".">' +
    '{[typeof values === "string" ? values : values["description"]]}' +
    '</tpl>',

    valueField: 'category',
    displayField: 'description',
    matchFieldWidth: false,
    typeAhead: false,
    forceSelection: false,

    store: 'BillCategory'
});
