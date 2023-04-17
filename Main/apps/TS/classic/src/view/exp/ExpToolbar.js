/**
 * Created by steve.tess on 7/13/2018.
 */
Ext.define('TS.view.exp.ExpToolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'toolbar-expenses',

    cls: 'toolbar-background',

    items: [
        {
            text: 'New Entry',
            iconCls: 'x-fa fa-plus-circle greenIcon',
            handler: 'startNewExpenseRow',
            reference: 'newEntryBtn',
            bind:{
                disabled: '{settings.expenseReadOnly}'
            }
        }, {
            xtype: 'textfield',
            hidden: true,
            reference: 'expReportIdField'
        }, {
            xtype: 'textfield',
            fieldLabel: 'Report Name',
            labelStyle: 'font-weight: bold;color: white;',
            labelAlign: 'right',
            bind: {
                readOnly: '{!settings.isNewExpReport}'
            },
            reference: 'expReportNameField',
            itemId: 'expReportNameField'
        }, {
            xtype: 'displayfield',
            fieldLabel: 'Report Date',
            style: 'color: white;',
            labelStyle: 'font-weight: bold;color: white;',
            fieldStyle: 'color: white;',
            labelAlign: 'right',
            reference: 'expReportDateField',
            renderer: renderDate
        }, {
            xtype: 'displayfield',
            labelStyle: 'white-space: nowrap; font-weight: bold;color: white;',
            labelWidth: 150,
            fieldLabel: 'Status',
            fieldStyle: 'color: white;',
            labelAlign: 'right',
            reference: 'expReportStatusField',
            renderer: function (value) {
                var record = Ext.getStore('FwaStatus').findRecord('value', value);
                return (record ? record.get('description') : '');
            }
        }, '->',
        {
            text: 'Open',
            handler: 'openExpReportList'
        },
        // {
        //     text: 'Copy',
        //     handler: 'copyExpenseItem'
        // },
        {
            text: 'Save',
            handler: 'onSaveExpenses',
            itemId: 'onSaveExpenseButton',
            bind:{
                disabled: '{settings.expenseReadOnly}'
            }
        },
        {
            text: 'Submit',
            handler: 'onSubmitExpenses',
            bind:{
                disabled: '{settings.expenseReadOnly}'
            }
        }
    ]
});