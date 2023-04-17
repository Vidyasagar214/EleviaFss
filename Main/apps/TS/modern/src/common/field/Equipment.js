/**
 * Created by steve.tess on 12/1/2016.
 */
Ext.define('TS.common.field.Equipment', {
    extend: 'Ext.field.Select',
    xtype: 'field-equipment',

    valueField: 'equipmentId',
    displayField: 'equipmentName',

    initialize: function () {
        var me = this,
            store = Ext.getStore('EquipmentList'),
            selection = TS.app.getViewport().getViewModel().get('selectedUnit');

        me.callParent(arguments);
        me.setStore(store);

        if(selection){
            if(IS_OFFLINE){
                me.getStore().clearFilter();
                me.getStore().addFilter({
                    filterFn: function (record) {
                        return record.get('unitCodeId') === selection.get('unitCodeId');
                    }
                });
             } else {
                me.getStore().getProxy().extraParams['unitCodeId'] = selection.get('unitCodeId');
                me.getStore().load(function (recs, op, success){
                });
            }
            // me.getStore().getProxy().extraParams['unitCodeId'] = selection.get('unitCodeId');
            // me.getStore().load();
        }

    }

});