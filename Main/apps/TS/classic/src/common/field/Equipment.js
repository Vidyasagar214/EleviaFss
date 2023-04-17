/**
 * Created by steve.tess on 5/8/2017.
 */
Ext.define('TS.common.field.Equipment', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-equipment',

    valueField: 'equipmentId',
    displayField: 'equipmentName',

    tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain"><tpl for=".">',
        '<li role="option" class="x-boundlist-item">{equipmentName}</li>',
        '</tpl></ul>'
    ),
    matchFieldWidth: false,
    forceSelection: true,
    queryMode: 'remote',

    store: 'EquipmentList',

    bind: {
        disabled: '{fwaUnitsReadOnly}'
    }
});