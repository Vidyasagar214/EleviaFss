/**
 * Created by steve.tess on 11/23/2016.
 */
Ext.define('TS.common.field.EquipmentList', {
    extend: 'Ext.form.field.ComboBox',

    xtype: 'field-equipmentlist',

    valueField: 'equipmentId',
    displayField: 'equipmentName',

    tpl: Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain"><tpl for=".">',
        '<li role="option" class="x-boundlist-item">{equipmentName}</li>',
        '</tpl></ul>'
    ),
    matchFieldWidth: false,
    forceSelection: false,
    queryMode: 'local',

    //storeId: 'EquipmentList'

    constructor: function (config) {
        var me = this;
        me.store = Ext.getStore('EquipmentList');

        me.store.getProxy().setExtraParams({
            unitCodeId: '__a3cDefault__a3e__a5e00105'
        });

        me.store.reload();
        me.callParent(arguments);
    }


});