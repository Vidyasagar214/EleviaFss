/**
 * Created by steve.tess on 9/6/2016.
 */
Ext.define('TS.common.grid.FwaActionList', {
    extend: 'Ext.grid.Panel',

    xtype: 'grid-fwaactions',
    requires: [
        'TS.common.field.ActionType',
        'TS.common.field.NonFieldActionItem'
    ],

    reference: 'fwaActionGrid',

    store: {
        model: 'TS.model.fwa.FwaAction'
    },

    viewConfig: {
        columnLines: false,
        markDirty: false
    },

    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],

    columns: [
        {
            text: 'Action',
            dataIndex: 'actionItemId',
            emptyText: '(Specify action)',
            flex: 2,
            editor: 'field-nonFieldActionItem',
            renderer: function (value) {
                var record = Ext.getStore('NonFieldActionItem').getById(value),
                    //need to check if a new row or rename
                    regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
                    match = regex.exec(value),
                    model;
                if (!record && value) {
                    model = {actionItemDescr: value, actionTypeId: value};
                    Ext.getStore('NonFieldActionItem').add(model);
                }
                //added id to model, so no need to match as a GUID //match ? '(Specify action)' : value);
                return (record ? record.get('actionItemDescr') : value ? value :'(Specify action)');
            }
        },
        {
            dataIndex: 'actionItemDescr',
            hidden: true
        },
        {
            text: 'Type',
            dataIndex: 'actionTypeId',
            editor: 'field-actiontype',
            flex: .5,
            renderer: function (value) {
                var record = Ext.getStore('ActionType').getById(value);
                return (record ? record.get('actionTypeDescr') : value);
            }
        },
        {
            text: 'Assigned To',
            dataIndex: 'actionOwnerId',
            editor: {
                xtype: 'field-allemployee',
                bind:{
                    disabled: '{!isScheduler}'
                }
            },
            flex: 1,
            renderer: function (value) {
                var record = Ext.getStore('AllEmployees').getById(value);
                return (record ? record.get('lname') + ', ' + record.get('fname') : '');
            }
        },
        {
            xtype: 'datecolumn',
            text: 'Complete Date',
            editor: {
                xtype: 'datefield',
                bind:{
                    disabled: '{!isScheduler}'
                }
            },
            dataIndex: 'actionDateCompleted',
            flex: 1,
            format: 'n/j/Y'
        },
        {
            xtype: 'actioncolumn',
            width: 30,
            resizable: false,
            menuDisabled: true,
            hideable: false,
            align: 'center',
            items: [{
                handler: 'clearCompleteDate',
                iconCls: 'workitem-delete',
                tooltip: 'Clear Complete Date'
            }],
            bind:{
                hidden: '{!isScheduler}'
            }
        },
        {
            text: 'Notes',
            dataIndex: 'actionNotes',
            editor: {
                xtype: 'textfield',
                bind:{
                    disabled: '{!isScheduler}'
                }
            },
            flex: 2

        }
    ],
    listeners:{
        afterrender: function(obj){
           var store = obj.getStore(),
               data = store.getRange();
           Ext.each(data, function(rec){
              rec.dirty = false;
           });
        }

    }
});