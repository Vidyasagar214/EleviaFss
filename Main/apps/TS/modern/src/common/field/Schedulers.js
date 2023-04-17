/**
 * Created by steve.tess on 12/15/2016.
 */
Ext.define('TS.common.field.Schedulers', {
    extend: 'Ext.field.Select',
    xtype: 'field-schedulers',
    autoSelect: false,

    config: {
        valueField: 'empId',
        displayField: 'empName',

        store: 'Schedulers',

        listeners:{
            focus: function(cb){
                var store = cb.getStore();
                store.filter('isScheduler', true);
            }
        }
    }
});