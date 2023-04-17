/**
 * Created by steve.tess on 7/23/2018.
 */
Ext.define('TS.view.exp.ExpEditor', {
    extend: 'Ext.form.Panel',
    xtype: 'exp-edit',

    reference: 'expEditForm',
    scrollable: 'y',

    items: [
        {
            xtype: 'titlebar',
            cls: 'ts-navigation-header',
            docked: 'top',
            title: 'Edit Expense',
            items: [
                {
                    align: 'right',
                    iconCls: 'x-fa fa-bars',
                    handler: 'onEditMenuTap',
                    reference: 'expenseEditMenuButton'
                }
            ]
        }, {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    text: {_tr: 'fwaAbbrevLabel'},
                    handler: 'showFwa',
                    ui: 'confirm',
                    reference: 'showFwaButton',
                    itemId: 'showFwaButton',
                    style: 'margin-right: 5px;'
                },
                {
                    text: 'Save',
                    align: 'left',
                    ui: 'action',
                    iconCls: 'x-fa fa-save',
                    handler: 'onSaveExpense',
                    style: 'margin-right: 5px;',
                    reference: 'updateExpButton',
                    itemId: 'updateExpButton'
                    // bind: {
                    //     disabled: '{!hasExpEditRights}' // need to turn on so user can still add a receipt/document
                    // }
                },
                {
                    text: 'Cancel',
                    align: 'right',
                    ui: 'decline',
                    iconCls: 'x-fa fa-times-circle',
                    handler: 'onCancelExp',
                    reference: 'cancelExpButton'
                }
            ]
        },
        {
            xtype: 'fieldset',
            items: [
                {
                    xtype: 'textfield',
                    reference: 'eKGroup',
                    bind: {
                        value: '{selectedEXP.eKGroup}',
                        hidden: true
                    }
                },
                {
                    xtype: 'textfield',
                    reference: 'reportName',
                    bind: {
                        value: '{selectedEXP.reportName}',
                        hidden: true
                    }
                },
                {
                    xtype: 'datepickerfield',
                    reference: 'reportDate',
                    bind: {
                        value: '{selectedEXP.reportDate}',
                        hidden: true
                    }
                },
                {
                    xtype: 'datepickerfield',
                    labelWidth: '35%',
                    label: 'Expense Date',
                    bind: {
                        value: '{selectedEXP.expDate}',
                        readOnly: '{!hasExpEditRights}'
                    },
                    reference: 'expDateField',
                    picker: {
                        yearFrom: new Date().getFullYear() - 1,
                        yearTo: new Date().getFullYear() + 1
                    },
                    disabledCls: ''
                }, {
                    xtype: 'field-allemployees',
                    label: 'Employee',
                    labelWidth: '35%',
                    name: 'empId',
                    reference: 'empIdField',
                    renderer: function (value) {
                        //all employees when displaying
                        var settings = TS.app.settings,
                            record = Ext.getStore('AllEmployees').getById(value || settings.empId);
                        return (record ? record.get('lname') + ', ' + record.get('fname') : 'N/A');
                    },
                    bind:{
                        value: '{selectedEXP.empId}'//,
                        //hidden: '{!isExa}'
                    }
                },{
                    xtype: 'field-expcategory',
                    labelWidth: '35%',
                    label: 'Category',
                    itemId: 'categoryField',
                    reference: 'categoryField',
                    bind: {
                        value: '{selectedEXP.category}',
                        readOnly: '{!hasExpEditRights}'
                    },
                    listeners: {
                        change: 'onCategoryChange'
                    },
                    disabledCls: ''
                }, {
                    xtype: 'textfield',
                    labelWidth: '35%',
                    label: 'Description',
                    itemId: 'descriptionField',
                    bind: {
                        value: '{selectedEXP.description}',
                        readOnly: '{!hasExpEditRights}'
                    },
                    disabledCls: ''
                }, {
                    xtype: 'numberfield',
                    labelWidth: '35%',
                    label: 'Amount',
                    itemId: 'amountField',
                    reference: 'amountField',
                    decimalPrecision: 2,
                    bind: {
                        value: '{selectedEXP.amount}',
                        readOnly: '{!hasExpEditRights}'
                    },
                    readOnly: true,
                    disabledCls: ''
                }, {
                    xtype: 'field-expfwalist',
                    labelWidth: '35%',
                    label: {_tr: 'fwaAbbrevLabel', tpl: '{0} #'},
                    reference: 'fwaNumberField',
                    bind: '{selectedEXP.fwaNum}',
                    readOnly: true,
                    //hidden: true
                }, {
                    xtype: 'textfield',
                    labelWidth: '35%',
                    label: {_tr: 'fwaAbbrevLabel', tpl: '{0} Name'},
                    reference: 'fwaNameField',
                    itemId: 'fwaNameField',
                    bind: {
                        value: '{fwaNumberField.selection.fwaName}'
                    },
                    readOnly: true,
                    //hidden: true
                }, {
                    xtype: 'container',
                    items: [
                        {
                            xtype: 'button',
                            top: '.0em',
                            right: '.0em',
                            iconCls: 'x-fa fa-search',
                            handler: 'onProjectLookup',
                            bind: {
                                disabled: '{!hasExpEditRights}'
                            }
                        }, {
                            label: {_tr: 'wbs1Label', tpl: '{0} #'},
                            labelWidth: '35%',
                            xtype: 'field-wbs',
                            modelName: 'Wbs1',
                            itemId: 'fwawbs1id',
                            reference: 'wbs1combo', //we rely on referenced field selection in the view model
                            deferredLoad: true, // Load the store until after initialization is complete
                            clears: ['fwawbs2id', 'fwawbs3id'], //References of fields that should be receive blank value when this field sets new value
                            sets: 'fwawbs2id', //Manipulates dependent store
                            //WBS2 needs wbs1 value
                            dependencyFilter: {
                                wbs1: 'fwawbs1id' // Proxy ExtraParam. Will set to dependency value
                            },
                            app: 'EXP',
                            bind: {
                                value: '{selectedEXP.wbs1}',
                                //readOnly: '{wbsLocked}',
                                hidden: '{hideExpWbs1}',
                                readOnly: '{!hasExpEditRights}'
                            },
                            listeners: {
                                change: 'onWbs1Change'
                            }
                        }
                    ]
                }, {
                    xtype: 'displayfield',
                    itemId: 'wbs1NameLabel',
                    labelWidth: '35%',
                    userCls: 'ts-long-label',
                    label: {_tr: 'wbs1Label', tpl: '{0} Name'},
                    bind: {
                        value: '{wbs1combo.selection.name}', // this is automatic field and will adjust to whatever selection is in combo
                        hidden: '{hideExpWbs1Name}'
                    }
                },
                {
                    label: {_tr: 'wbs2Label', tpl: '{0} #'},
                    labelWidth: '35%',
                    xtype: 'field-wbs',
                    itemId: 'fwawbs2id',
                    reference: 'wbs2combo',
                    clears: ['fwawbs3id'],
                    modelName: 'Wbs2',
                    app: 'FWA',
                    sets: 'fwawbs3id',
                    //WBS3 needs both wbs1 and wbs2 values
                    dependencyFilter: {
                        wbs1: 'fwawbs1id',
                        wbs2: 'fwawbs2id'
                    },
                    bind: {
                        value: '{selectedEXP.wbs2}',
                        // readOnly: '{wbsLocked}',
                        hidden: '{hideExpWbs2}',
                        readOnly: '{!hasExpEditRights}'
                    },
                    listeners: {
                        change: 'onWbsChange'
                    }
                },
                {
                    xtype: 'displayfield',
                    itemId: 'wbs2NameLabel',
                    labelWidth: '35%',
                    userCls: 'ts-long-label',
                    label: {_tr: 'wbs2Label', tpl: '{0} Name'},
                    bind: {
                        value: '{wbs2combo.selection.name}',
                        hidden: '{hideExpWbs2Name}'
                    }
                },
                {
                    label: {_tr: 'wbs3Label', tpl: '{0} #'},
                    labelWidth: '35%',
                    xtype: 'field-wbs',
                    itemId: 'fwawbs3id',
                    reference: 'wbs3combo',
                    modelName: 'Wbs3',
                    app: 'FWA',
                    bind: {
                        value: '{selectedExp.wbs3}',
                        //readOnly: '{wbsLocked}',
                        hidden: '{hideExpWbs3}',
                        readOnly: '{!hasExpEditRights}'
                    }
                },
                {
                    xtype: 'displayfield',
                    itemId: 'wbs3NameLabel',
                    labelWidth: '35%',
                    label: {_tr: 'wbs3Label', tpl: '{0} Name'},
                    bind: {
                        value: '{wbs3combo.selection.name}',
                        hidden: '{hideExpWbs3Name}'
                    }
                }, {
                    xtype: 'field-expaccount',
                    labelWidth: '35%',
                    label: 'Account',
                    reference: 'accountField',
                    bind: {
                        value: '{selectedEXP.account}',
                        hidden: '{hideAccount}',
                        readOnly: '{!hasExpEditRights}'
                    },
                    disabledCls: ''
                },
                {
                    xtype: 'displayfield',
                    labelWidth: '35%',
                    label: 'Account Name',
                    bind: {
                        value: '{accountField.selection.accountName}',
                        hidden: '{hideAccountName}'
                    }
                },
                {
                    xtype: 'checkboxfield',
                    labelWidth: '35%',
                    bind: {
                        value: '{selectedEXP.billable}',
                        hidden: '{!displayBillable}',
                        disabled: '{!hasExpEditRights}'
                    },
                    label: 'Billable',
                    reference: 'billableCheckBoxField',
                    disabledCls: '',
                    listeners: {
                        change: 'onBillableChange'
                    }
                },
                {
                    xtype: 'checkboxfield',
                    labelWidth: '35%',
                    bind: {
                        value: '{selectedEXP.companyPaid}',
                        hidden: '{!displayCompanyPaid}',
                        disabled: '{!hasExpEditRights}'
                    },
                    label: 'Company Paid',
                    reference: 'companyPaidCheckBoxField',
                    disabledCls: ''
                }, {
                    xtype: 'textareafield',
                    labelWidth: '35%',
                    label: 'Business Reason',
                    bind: {
                        value: '{selectedEXP.reason}',
                        readOnly: '{!hasExpEditRights}'
                    },
                    reference: 'reasonField',
                    hidden: true
                }, {
                    xtype: 'textareafield',
                    labelWidth: '35%',
                    label: 'Name of each person',
                    bind: {
                        value: '{selectedEXP.other}',
                        readOnly: '{!hasExpEditRights}'
                    },
                    reference: 'otherField',
                    hidden: true
                }, {
                    xtype: 'numberfield',
                    labelWidth: '35%',
                    label: {_tr: 'exMileageRateLabel',tpl: '{0}s Driven'},
                    bind: {
                        value: '{selectedEXP.miles}',
                        readOnly: '{settings.MileageRateReadOnly}'
                    },
                    reference: 'milesField',
                    listeners: {
                        blur: 'setMileageAmount'
                    },
                    hidden: true
                }, {
                    xtype: 'numberfield',
                    labelWidth: '35%',
                    label: 'Mileage Rate',
                    bind: {
                        value: '{selectedEXP.amountPerMile}',
                        readOnly: '{!hasExpEditRights}'
                    },
                    reference: 'amountPerMileField',
                    hidden: true
                }
            ]
        }
    ]
});