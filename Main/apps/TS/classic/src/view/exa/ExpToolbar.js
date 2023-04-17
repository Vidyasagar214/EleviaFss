/**
 * Created by steve.tess on 8/21/2018.
 */
Ext.define('TS.view.exa.ExpToolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'toolbar-approvalexpenses',

    items: [
        {
            xtype: 'displayfield',
            hidden: true,
            itemId: 'expReportIdField'
        },
        {
            xtype: 'displayfield',
            fieldLabel: 'Report Name',
            labelStyle: 'color: white; font-weight: bold',
            labelAlign: 'right',
            fieldStyle: 'color: white;',
            itemId: 'expReportNameField',
            style: 'color: white'
        }, {
            xtype: 'displayfield',
            fieldLabel: 'ReportDate',
            labelStyle: 'color: white; font-weight: bold',
            labelAlign: 'right',
            fieldStyle: 'color: white;',
            itemId: 'expReportDateField',
            //readOnly: true
        }, {
            xtype: 'displayfield',
            labelStyle: 'color: white; white-space: nowrap; font-weight: bold',
            labelWidth: 150,
            fieldLabel: 'Expense Report Status',
            fieldStyle: 'color: white;',
            labelAlign: 'right',
            itemId: 'expReportStatusField',
            renderer: function (value) {
                var record = Ext.getStore('FwaStatus').findRecord('value', value);
                return (record ? record.get('description') : '');
            }
        }, '->',
        {
            text: 'Save',
            handler: 'onSaveExpenses',
            itemId: 'saveExpenseButton'
        },
        {
            text: 'Submit',
            handler: 'onSubmitExpenses',
            itemId: 'submitExpenseButton'
        }
    ]
});