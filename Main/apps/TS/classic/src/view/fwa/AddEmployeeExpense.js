/**
 * Created by steve.tess on 7/20/2018.
 */
Ext.define('TS.view.fwa.AddEmployeeExpense', {
    extend: 'Ext.window.Window',
    xtype: 'window-addemployeeexpense',

    controller: 'addemployeeexpense',

    modal: true,
    width: 440,
    height: 650,
    layout: 'fit',
    bodyPadding: 10,
    constrainHeader: true,

    title: 'Add Employeee Expense',
    titleAlign: 'center',

    items: [
        {
            xtype: 'form',
            scrollable: true,
            reference: 'expenseEditorForm',
            itemId: 'expenseEditorForm',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: [
                {
                    xtype: 'textfield',
                    hidden: true,
                    name: 'id'
                },
                {
                    xtype: 'textfield',
                    hidden: true,
                    reference: 'expReportId',
                    name: 'expReportId'
                }, {
                    xtype: 'textfield',
                    hidden: true,
                    itemId: 'expId',
                    reference: 'expId',
                    name: 'expId'
                }, {
                    xtype: 'datefield',
                    fieldLabel: 'Date',
                    itemId: 'expDate',
                    reference: 'expDate',
                    name: 'expDate'
                }, {
                    xtype: 'field-employee',
                    fieldLabel: 'Employee',
                    itemId: 'empid',
                    reference: 'empid',
                    name: 'empId'
                }, {
                    xtype: 'field-expensecategory',
                    fieldLabel: 'Category',
                    itemId: 'categoryId',
                    reference: 'categoryId',
                    name: 'category',
                    listeners: {
                        change: 'getCategoryDetails'
                    }
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Description',
                    name: 'description',
                    itemId: 'description',
                    reference: 'description'
                }, {
                    xtype: 'textarea',
                    fieldLabel: 'Business reason for expense',
                    name: 'reason',
                    reference: 'reasonField',
                    hidden: true
                }, {
                    xtype: 'textarea',
                    fieldLabel: 'Travel From/To', //'Name of each person',
                    name: 'other',
                    reference: 'otherField',
                    hidden: true
                }, {
                    xtype: 'numberfield',
                    fieldLabel: '# Miles',
                    name: 'miles',
                    reference: 'milesField',
                    hidden: true
                }, {
                    xtype: 'numberfield',
                    name: 'amount',
                    itemId: 'expAmount',
                    reference: 'expAmount',
                    minValue: 0,
                    fieldLabel: 'Amount',
                    fieldStyle: "text-align:right;"
                },
                {
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'checkboxfield',
                            fieldLabel: 'Billable',
                            name: 'billable',
                            reference: 'billableCheckbox'
                        },
                        {
                            padding: '0 0 0 20',
                            xtype: 'checkboxfield',
                            fieldLabel: 'Company Paid',
                            name: 'companyPaid',
                            reference: 'companyPaidCheckbox'
                        }
                    ]
                },
                {
                    xtype: 'button',
                    text: 'Attach Document',
                    handler: 'attachDocument'
                }

            ]
        }
    ],
    buttons: [{
        text: 'Update',
        handler: 'saveExpenseDetails',
        reference: 'updateExpenseBtn',
        formBind: true
    }, {
        text: 'Cancel',
        handler: 'cancelExpenseEditing'
    }]


});