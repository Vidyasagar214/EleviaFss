/**
 * Created by steve.tess on 11/22/2016.
 */
Ext.define('TS.common.field.UnitCode', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-unitcode',

    valueField: 'unitCodeId',
    displayField: 'unitCodeAbbrev',

    tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain"><tpl for=".">',
        '<li role="option" class="x-boundlist-item">{unitCodeAbbrev} - {unitCodeName}</li>',
        '</tpl></ul>'
    ),
    matchFieldWidth: false,
    forceSelection: true,
    queryMode: 'remote',

    store: 'UnitCode',

    bind: {
        disabled: '{fwaUnitsReadOnly}'
    },

    listeners: {
        focus: function (t) {
            t.expand();
        }
    }
});