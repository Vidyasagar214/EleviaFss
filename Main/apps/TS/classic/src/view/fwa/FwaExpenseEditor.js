/**
 * Created by steve.tess on 10/18/2018.
 */
Ext.define('TS.view.fwa.FwaExpenseEditor', {
    extend: 'Ext.window.Window',

    xtype: 'fwa-expenseeditor',

    requires: [
        'TS.controller.fwa.EmployeeExpensesController',
        'TS.model.exp.ExpListModel'
    ],

    controller: 'grid-employeeexpenses',
    viewModel: 'explist',

    title: 'Expense Editor',
    width: 440,
    height: 525,
    layout: 'fit',
    bodyPadding: 10,
    autoShow: true,
    record: null,
    scrollable: 'y',

    items: [
        {
            xtype: 'form',
            scrollable: 'y',
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
                    name: 'fwaId',
                    reference: 'fwaIdField'
                },
                {
                    xtype: 'textfield',
                    hidden: true,
                    reference: 'empEkGroupField',
                    name: 'eKGroup'
                },
                {
                    xtype: 'textfield',
                    hidden: true,
                    reference: 'expReportId',
                    name: 'expReportId'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Report Date',
                    reference: 'expReportDateField',
                    hidden: true,
                    name: 'reportDate',
                    renderer: renderDate
                },
                {
                    xtype: 'textfield',
                    hidden: true,
                    itemId: 'expId',
                    reference: 'expId',
                    name: 'expId'
                }, {
                    xtype: 'field-employee',
                    fieldLabel: 'Employee',
                    itemId: 'empid',
                    reference: 'empid',
                    name: 'empId'
                    //hidden: true
                }, {
                    xtype: 'datefield',
                    fieldLabel: 'Expense Date',
                    itemId: 'expDate',
                    reference: 'expDate',
                    name: 'expDate',
                    disabledCls: ''
                }, {
                    xtype: 'field-expensecategory',
                    fieldLabel: 'Category',
                    itemId: 'categoryId',
                    reference: 'categoryField',
                    name: 'category',
                    listeners: {
                        change: 'getCategoryDetails',
                        afterrender: function (combo) {
                            var store = combo.getStore();
                            if (!combo.getValue()) {
                                combo.setValue(store.getAt(0).get(combo.valueField));
                            }
                        }
                    },
                    disabledCls: ''
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Description',
                    name: 'description',
                    itemId: 'description',
                    reference: 'description',
                    disabledCls: ''
                }, {
                    xtype: 'numberfield',
                    name: 'amount',
                    itemId: 'expAmount',
                    reference: 'amountField',
                    decimalPrecision: 2,
                    minValue: 0,
                    fieldLabel: 'Amount',
                    fieldStyle: "text-align:right;",
                    disabledCls: '',
                    listeners: {
                        change: 'onExpenseChange'
                    }
                }, {
                    xtype: 'displayfield',
                    fieldLabel: 'Charge Type',
                    reference: 'chargeType',
                    hidden: true
                }, {
                    xtype: 'field-expfwalist',
                    fieldLabel: {_tr: 'fwaAbbrevLabel', tpl: '{0} #'},
                    reference: 'fwaNumField',
                    name: 'fwaNum',
                    disabledCls: '',
                    hidden: true,
                    listeners: {
                        change: 'onFwaSelect'
                    }
                }, {
                    xtype: 'textfield',
                    fieldLabel: {_tr: 'fwaAbbrevLabel', tpl: '{0} Name'},
                    readOnly: true,
                    reference: 'fwaNameField',
                    name: 'fwaName',
                    bind: {
                        value: '{fwaNumField.selection.fwaName}'
                    },
                    hidden: true
                }, {
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            fieldLabel: {_tr: 'wbs1Label', tpl: '{0} #'},
                            xtype: 'field-wbs',
                            modelName: 'Wbs1',
                            name: 'wbs1',
                            itemId: 'exp_fwawbs1id',
                            reference: 'wbs1combo',
                            app: 'EXP',
                            flex: 1,
                            nameField: 'fwawbs1name',
                            typeAhead: true,
                            queryParam: 'filter',
                            listeners: {
                                change: 'onWbs1ComboChange'
                            },
                            allowBlank: false,
                            forceSelection: true,
                            editable: true,
                            disabledCls: ''

                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'button',
                            app: 'EXP',
                            iconCls: 'x-fa fa-search', //'resources/images/icons/magnifier.png',
                            width: 24,
                            handler: 'showProjectLookupWindow',
                            reference: 'projectButton',
                            disabledCls: '',
                            hidden: true
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    reference: 'wbs1Field',
                    name: 'wbs1',
                    hidden: true,
                    readOnly: true
                },
                {
                    xtype: 'textfield',
                    userCls: 'ts-long-label',
                    name: 'wbs1Name',
                    fieldLabel: {_tr: 'wbs1Label', tpl: '{0} Name'},
                    bind: {
                        value: '{wbs1combo.selection.name}',
                        hidden: '{hideExpWbs1Name}'
                    },
                    readOnly: true
                },
                {
                    fieldLabel: {_tr: 'wbs2Label', tpl: '{0} #'},
                    xtype: 'field-wbs',
                    anchor: '-28',
                    itemId: 'exp_fwawbs2id',
                    reference: 'wbs2combo',
                    // clears: ['fwawbs3id'],
                    modelName: 'Wbs2',
                    name: 'wbs2',
                    app: 'EXP',
                    bind: {
                        hidden: '{hideExpWbs2}'
                    },
                    nameField: 'fwawbs2name',
                    forceSelection: true,
                    editable: false,
                    listeners: {
                        change: 'onWbs2ComboChange'
                    },
                    disabledCls: ''
                },
                {
                    xtype: 'textfield',
                    userCls: 'ts-long-label',
                    name: 'wbs2Name',
                    fieldLabel: {_tr: 'wbs2Label', tpl: '{0} Name'},
                    bind: {
                        value: '{wbs2combo.selection.name}',
                        hidden: '{hideExpWbs2Name}'
                    },
                    readOnly: true
                },
                {
                    fieldLabel: {_tr: 'wbs3Label', tpl: '{0} #'},
                    xtype: 'field-wbs',
                    itemId: 'exp_fwawbs3id',
                    reference: 'wbs3combo',
                    modelName: 'Wbs3',
                    name: 'wbs3',
                    app: 'EXP',
                    flex: 1,
                    bind: {
                        hidden: '{hideExpWbs3}'
                    },
                    anchor: '-28',
                    nameField: 'fwawbs3name',
                    forceSelection: true,
                    editable: false,
                    listeners: {
                        change: 'onWbs3ComboChange'
                    },
                    disabledCls: ''
                },
                {
                    xtype: 'textfield',
                    fieldLabel: {_tr: 'wbs3Label', tpl: '{0} Name'},
                    reference: 'fwawbs3name',
                    name: 'wbs3Name',
                    bind: {
                        value: '{wbs3combo.selection.name}',
                        hidden: '{hideExpWbs3Name}'
                    },
                    readOnly: true
                },
                {
                    xtype: 'checkboxfield',
                    fieldLabel: 'Billable',
                    name: 'billable',
                    reference: 'billableCheckbox',
                    itemId: 'billableCheckbox',
                    bind: {
                        hidden: '{!settings.exDisplayBillable}'
                    },
                    listeners: {
                        change: 'onBillableChange'
                    },
                    disabledCls: ''
                },
                {
                    padding: '0 0 0 20',
                    xtype: 'checkboxfield',
                    fieldLabel: 'Company Paid',
                    name: 'companyPaid',
                    reference: 'companyPaidCheckbox',
                    itemId: 'companyPaidCheckbox',
                    bind: {
                        hidden: '{!settings.exDisplayCompanyPaid}'
                    },
                    disabledCls: ''
                }, {
                    xtype: 'field-expenseaccount',
                    fieldLabel: 'Account',
                    itemId: 'account',
                    reference: 'account',
                    name: 'account',
                    bind: {
                        hidden: '{hideAccount}'
                    },
                    disabledCls: ''
                }, {
                    xtype: 'textfield',
                    userCls: 'ts-long-label',
                    fieldLabel: 'Account Name',
                    bind: {
                        value: '{account.selection.accountName}',
                        hidden: '{hideAccountName}'
                    },
                    disabledCls: '',
                    readOnly: true
                }, {
                    xtype: 'textarea',
                    fieldLabel: 'Business reason for expense',
                    name: 'reason',
                    reference: 'reasonField',
                    hidden: true,
                    disabledCls: ''
                }, {
                    xtype: 'textarea',
                    fieldLabel: 'Travel From/To', //'Name of each person',
                    name: 'other',
                    reference: 'otherField',
                    hidden: true,
                    disabledCls: ''
                }, {
                    xtype: 'numberfield',
                    fieldLabel: '# Miles',
                    name: 'miles',
                    reference: 'milesField',
                    hidden: true,
                    listeners: {
                        blur: 'setMileageAmount'
                    },
                    disabledCls: ''
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Mileage Rate',
                    readOnly: true,
                    reference: 'amountPerMileField',
                    hidden: true,
                    decimalPrecision: 3,
                    name: 'amountPerMile',
                    disabledCls: ''
                },
                {
                    xtype: 'textfield',
                    hidden: true,
                    reference: 'modifiedCheckbox',
                    name: 'modified'
                }
            ]
        }
    ],

    buttons: [
        {
            text: {_tr: 'fwaAbbrevLabel'},
            reference: 'fwaButton',
            handler: 'showFwa'
        },
        {
            text: 'Attach Doc',
            handler: 'attachDocument',
            reference: 'attachButton',
            itemId: 'attachButton'
        }, '->', {
            text: 'Update',
            handler: 'saveExpenseDetails',
            reference: 'updateExpenseBtn',
            formBind: true
        }, {
            text: 'Cancel',
            handler: 'cancelExpenseEditing'
        }
    ]

});