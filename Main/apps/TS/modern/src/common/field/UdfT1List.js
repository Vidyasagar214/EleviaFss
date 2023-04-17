/**
 * Created by steve.tess on 12/15/2016.
 */
Ext.define('TS.common.field.UdfT1List', {
    extend: 'Ext.field.Select',
    xtype: 'field-udfT1-list',
    autoSelect: false,

    config: {
        valueField: 'udfName',
        displayField: 'udfName',

        store: 'UdfList1',

        listeners:{
            focus: function(cb){
                var store = cb.getStore();
                store.filter('udfId', 'UDFT1');
            }
        }
    }
});