Ext.define('TS.common.field.WorkCode', {

    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-workcode',

    requires: [
        'TS.store.WorkCodeList'
    ],

    valueField: 'workCodeAbbrev',
    displayField: 'workCodeAbbrev',
    renderTo: Ext.getBody(),
    tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain"><tpl for=".">',
        '<li role="option" class="x-boundlist-item">{workCodeAbbrev} - {workCodeDescr}</li>',
        '</tpl></ul>'
    ),
    matchFieldWidth: false,
    forceSelection: true,
    queryMode: 'local',

    store: 'WorkCodeList',

    listeners: {
        focus: function (t) {
            t.expand();
        }
    }

});
