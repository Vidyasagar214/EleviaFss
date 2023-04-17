/**
 * Created by steve.tess on 7/12/2018.
 */
Ext.define('TS.view.exp.ExpenseEditor', {
    extend: 'Ext.window.Window',

    xtype: 'window-expenseeditor',

    requires: [
        'TS.controller.exp.ExpenseEditorController',
        'TS.model.exp.ExpListModel'
    ],

    controller: 'expenseeditor',
    viewModel: 'explist',

    title: 'Expense Editor',
    width: 440,
    layout: 'fit',
    minHeight: 500,
    bodyPadding: 10,
    autoShow: true,
    record: null,
    scrollable: 'y',

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
                    reference: 'eKGroupField',
                    name: 'eKGroup'
                },
                {
                    xtype: 'textfield',
                    hidden: true,
                    reference: 'reportNameField',
                    name: 'reportName'
                },
                {
                    xtype: 'textfield',
                    hidden: true,
                    reference: 'expReportId',
                    name: 'expReportId'
                },
                {
                    xtype: 'datefield',
                    fieldLabel: 'Report Date',
                    reference: 'expReportDateField',
                    hidden: true,
                    name: 'reportDate'
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
                    name: 'empId',
                    bind: {
                        hidden: '{!isExa}'
                    }
                }, {
                    xtype: 'datefield',
                    fieldLabel: 'Expense Date',
                    itemId: 'expDate',
                    reference: 'expDate',
                    name: 'expDate',
                    disabledCls: '',
                    bind: {
                        disabled: '{!hasExpEditRights}'
                    }
                }, {
                    xtype: 'field-expensecategory',
                    fieldLabel: 'Category',
                    itemId: 'categoryId',
                    reference: 'categoryField',
                    name: 'category',
                    listeners: {
                        change: 'getCategoryDetails'
                    },
                    disabledCls: '',
                    bind: {
                        disabled: '{!hasExpEditRights}'
                    }
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Description',
                    name: 'description',
                    itemId: 'description',
                    reference: 'description',
                    disabledCls: '',
                    bind: {
                        disabled: '{!hasExpEditRights}'
                    }
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
                    },
                    bind: {
                        disabled: '{!hasExpEditRights}'
                    }
                }, {
                    xtype: 'displayfield',
                    fieldLabel: 'Charge Type',
                    reference: 'chargeType',
                    hidden: true,
                    bind: {
                        disabled: '{!hasExpEditRights}'
                    }
                }, {
                    xtype: 'field-expfwalist',
                    fieldLabel: {_tr: 'fwaAbbrevLabel', tpl: '{0}'},
                    reference: 'fwaNumField',
                    name: 'fwaNum',
                    disabledCls: '',
                    bind: {
                        disabled: true// '{!hasExpEditRights}'
                    },
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
                    }
                }, {
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            fieldLabel: {_tr: 'wbs1Label', tpl: '{0} #'},
                            xtype: 'field-wbs1',
                            modelName: 'Wbs1',
                            name: 'wbs1',
                            itemId: 'fwawbs1id',
                            reference: 'wbs1combo',
                            app: 'EXP',
                            flex: 1,
                            nameField: 'fwawbs1name',
                            typeAhead: true,
                            minChars: 2,
                            queryParam: 'filter',
                            listeners: {
                                change: 'onWbs1ComboChange'
                            },
                            allowBlank: false,
                            forceSelection: true,
                            editable: true,
                            disabledCls: '',
                            bind: {
                                disabled: '{!hasExpEditRights}'
                            }

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
                            bind: {
                                disabled: '{!hasExpEditRights}'
                            }
                        }
                    ]
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
                    itemId: 'fwawbs2id',
                    reference: 'wbs2combo',
                    // clears: ['fwawbs3id'],
                    modelName: 'Wbs2',
                    name: 'wbs2',
                    app: 'EXP',
                    bind: {
                        hidden: '{hideExpWbs2}',
                        disabled: '{!hasExpEditRights}'
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
                    itemId: 'fwawbs3id',
                    reference: 'wbs3combo',
                    modelName: 'Wbs3',
                    name: 'wbs3',
                    app: 'EXP',
                    flex: 1,
                    bind: {
                        hidden: '{hideExpWbs3}',
                        disabled: '{!hasExpEditRights}'
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
                        hidden: '{!settings.exDisplayBillable}',
                        disabled: '{!hasExpEditRights}'
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
                        hidden: '{!settings.exDisplayCompanyPaid}',
                        disabled: '{!hasExpEditRights}'
                    },
                    disabledCls: ''
                }, {
                    xtype: 'field-expenseaccount',
                    fieldLabel: 'Account',
                    itemId: 'account',
                    reference: 'account',
                    name: 'account',
                    bind: {
                        hidden: '{hideAccount}',
                        disabled: '{!hasExpEditRights}'
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
                    disabledCls: '',
                    bind: {
                        disabled: '{!hasExpEditRights}'
                    }
                }, {
                    xtype: 'textarea',
                    fieldLabel: 'Travel From/To', //'Name of each person',
                    name: 'other',
                    reference: 'otherField',
                    hidden: true,
                    disabledCls: '',
                    bind: {
                        disabled: '{!hasExpEditRights}'
                    }
                }, {
                    xtype: 'numberfield',
                    fieldLabel: {_tr: 'exMileageRateLabel', tpl: ' # {0}s'},
                    name: 'miles',
                    reference: 'milesField',
                    hidden: true,
                    listeners: {
                        blur: 'setMileageAmount'
                    },
                    disabledCls: '',
                    bind: {
                        disabled: '{!hasExpEditRights}'
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: 'Mileage Rate',
                    readOnly: true,
                    reference: 'amountPerMileField',
                    hidden: true,
                    name: 'amountPerMile',
                    decimalPrecision: 3,
                    bind: {
                        disabled: '{settings.exMileageRateReadOnly || !hasExpEditRights}'
                    },
                    disabledCls: ''
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
            bind: {
                disabled: '{!hasExpEditRights}',
                hidden: '{settings.nsExpenseEntry}'
            }
        }, '->', {
            text: 'Update',
            handler: 'saveExpenseDetails',
            reference: 'updateExpenseBtn',
            itemId: 'updateExpenseBtn',
            formBind: true,
            bind: {
                disabled: '{!hasExpEditRights}'
            }
        }, {
            text: 'Cancel',
            handler: 'cancelExpenseEditing'
        }
    ]
});