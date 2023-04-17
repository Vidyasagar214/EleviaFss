
Ext.define('TS.common.field.BillCat', {
    extend: 'Ext.field.Select',
    xtype: 'field-billcategory',

    requires: [
        'TS.model.shared.BillCategory'
    ],

    config: {
        valueField: 'category',
        displayField: 'description'
    },

    initialize: function () {
        //var cfg = this.config;

        this.setStore({
            model: 'TS.model.shared.BillCategory',
            autoLoad: true,
            pageSize: 1000
        });

        this.callParent();
    }
});