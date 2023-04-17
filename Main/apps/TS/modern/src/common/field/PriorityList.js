/**
 * Created by steve.tess on 8/29/2016.
 */
Ext.define('TS.common.field.PriorityList', {
    extend: 'Ext.field.Select',
    xtype: 'field-prioritylist',

    config: {
        valueField: 'priorityId',
        displayField: 'priorityDescr',
        store: 'PriorityList',
        padding: 5,
        listeners: {
            change: function (obj, newValue) {
                if (newValue)
                {
                    var priority = Ext.getStore('PriorityList').findRecord('priorityId', newValue.get('priorityId')),
                        colors;
                    obj.parent.parent.parent.getViewModel().get('selectedFWA').dirty = true;
                }
                if (priority)
                    colors = priority.get('priorityHighlightColor');
                if (colors)
                    obj.parent.parent.parent.getViewModel().get('selectedFWA').set('fieldPriorityColor', 'background-color:rgb(' + colors + ')');
            }
        }
    }
});

