/**
 * Created by steve.tess on 8/1/2018.
 */
Ext.define('TS.view.fwa.ManageExpenses', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-manageexpenses',

    requires: [
        'Ext.grid.plugin.Editable',
        //  'TS.common.field.AllEmployees'
    ],

    controller: 'fwa-edit',
    // viewModel: 'fwa-main',
    itemId: 'manageExpenses',

    stretchX: true,
    stretchY: true,
    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: 'Expenses',
            items: [
                {
                    iconCls: 'x-fa fa-plus',
                    handler: 'addExpense',
                    itemId: 'addButton',
                    reference: 'addButton'
                },
                {
                    align: 'right',
                    text: 'Close',
                    handler: 'closeSheet'
                }
            ]
        },
        {
            xtype: 'grid',
            reference: 'expensesGrid',
            itemId: 'expensesGrid',
            //itemTpl: '{workDate}',
            grouped: true,
            bind: {
                store: '{selectedFWA.expenses}',
                selection: '{selectedEXP}'
            },

            emptyText: 'Tap plus icon to add expenses',
            deferEmptyText: false,

            plugins: [
                {
                    type: 'grideditable',
                    //disableSubmitBt: true,  // You can disable submit button now from here
                    triggerEvent: 'singletap',
                    itemId: 'gridPlugin',
                    //set programmatically in controller
                    //enableDeleteButton: true,
                    formConfig: {
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'modified',
                                reference: 'modifiedField',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                reference: 'fwaIdField',
                                hidden: true
                            },
                            {
                                xtype: 'datepickerfield',
                                name: 'reportDate',
                                hidden: true
                            },
                            {
                                xtype: 'field-allemployees',
                                label: 'Employee',
                                labelWidth: '35%',
                                name: 'empId',
                                renderer: function (value) {
                                    //all employees when displaying
                                    var settings = TS.app.settings,
                                        record = Ext.getStore('AllEmployees').getById(value || settings.empId);
                                    return (record ? record.get('lname') + ', ' + record.get('fname') : 'N/A');
                                }
                            },
                            {
                                xtype: 'datepickerfield',
                                name: 'expDate', //this should match dataIndex you would like to edit
                                itemId: 'expDate',
                                labelWidth: '35%',
                                label: 'Date',
                                disabledCls: ''
                            }, {
                                xtype: 'field-expcategory',
                                label: 'Category',
                                labelWidth: '35%',
                                name: 'category',
                                itemId: 'categoryEditField',
                                reference: 'categoryEditField',
                                listeners: {
                                    change: function (obj, newValue, oldValue, eOpts) {
                                        if (!newValue) return;
                                        var me = this,
                                            record = Ext.getStore('ExpCategory').getById(newValue.get('category')),
                                            reasonField = obj.parent.innerItems.find(o => o.referenceKey == 'reasonField'), //[14],
                                            otherField = obj.parent.innerItems.find(o => o.referenceKey == 'otherField'), //[15],
                                            milesField = obj.parent.innerItems.find(o => o.referenceKey == 'milesField'), //[16],
                                            amountPerMileField = obj.parent.innerItems.find(o => o.referenceKey == 'amountPerMileField'), //[17],
                                            billableField = obj.parent.innerItems.find(o => o.referenceKey == 'billableField'), //[12],
                                            detailType,

                                            settings = TS.app.settings,
                                            categoryField = obj.parent.innerItems.find(o => o.referenceKey == 'categoryEditField'),//me.lookup('categoryEditField'),
                                            categoryStore = categoryField.getStore(),
                                            categoryRecord = categoryStore.findRecord('category', categoryField.getValue()),
                                            wbs1Field = obj.parent.innerItems.find(o => o.referenceKey == 'wbs1Container').getItems().items[1],//me.lookup('wbs1combo'),
                                            wbs1Store = wbs1Field.getStore(),
                                            accountField = obj.parent.innerItems.find(o => o.referenceKey == 'accountField'),//me.lookup('accountField'),
                                            accountNameField = obj.parent.innerItems.find(o => o.referenceKey == 'accountNameField'),//me.lookup('accountNameField'),
                                            accountStore = accountField.getStore(),
                                            billByDefault = categoryRecord.get('billByDefault'),
                                            chargeType,
                                            acctRecord;

                                        //set account field
                                        if (wbs1Field.getValue() && categoryRecord) {
                                            chargeType = wbs1Store.findRecord('id', wbs1Field.getValue()).get('chargeType');
                                            accountStore.clearFilter();
                                            if (chargeType == 'R') {
                                                if (billableField.getValue()) {
                                                    //accountStore.filter('useOnRegularProjects', true);
                                                    accountField.setValue(categoryRecord.get('defaultRegularBillableAccount'));
                                                    acctRecord = accountStore.findRecord('account', accountField.getValue() || accountField.cachedValue);
                                                    accountNameField.setValue(acctRecord.get('accountName'));
                                                } else {
                                                    //accountStore.filter('useOnRegularProjects', false);
                                                    accountField.setValue(categoryRecord.get('defaultRegularNonbillableAccount'));
                                                    acctRecord = accountStore.findRecord('account', accountField.getValue() || accountField.cachedValue);
                                                    accountNameField.setValue(acctRecord.get('accountName'));
                                                }
                                                billableField.setHidden(!settings.exDisplayBillable);
                                            } else {
                                                //accountStore.filter('useOnRegularProjects', false);
                                                accountField.setValue(categoryRecord.get('defaultNonRegularAccount'));
                                                billableField.setValue(false);
                                                billableField.setHidden(true);
                                                acctRecord = accountStore.findRecord('account', accountField.getValue() || accountField.cachedValue);
                                                accountNameField.setValue(acctRecord.get('accountName'));
                                            }
                                        } else if (categoryRecord) {
                                            billableField.setValue(billByDefault);
                                            if (billByDefault) {
                                                //accountStore.filter('useOnRegularProjects', true);
                                                accountField.setValue(categoryRecord.get('defaultRegularBillableAccount'));
                                            } else {
                                                //accountStore.filter('useOnRegularProjects', false);
                                                accountField.setValue(categoryRecord.get('defaultRegularNonbillableAccount'));
                                            }
                                        }

                                        reasonField.setHidden(true);
                                        otherField.setHidden(true);
                                        milesField.setHidden(true);
                                        amountPerMileField.setHidden(true);

                                        if (record) {
                                            detailType = record.get('detailType');
                                            switch (detailType) {
                                                case 'M':
                                                    reasonField.setHidden(false);
                                                    reasonField.setLabel('Business reason</br>for expense');
                                                    otherField.setHidden(false);
                                                    otherField.setLabel('Travel From/To');
                                                    milesField.setHidden(false);
                                                    amountPerMileField.setHidden(false);
                                                    break;
                                                case 'B':
                                                    reasonField.setHidden(false);
                                                    reasonField.setLabel('Business reason</br>for expense');
                                                    otherField.setHidden(false);
                                                    otherField.setLabel('Name of</br>each person');
                                                    break;
                                                case 'G':
                                                    reasonField.setHidden(false);
                                                    reasonField.setLabel('Business reason</br>for expense');
                                                    break;
                                            }

                                            //billableField.setValue(record.get('billByDefault'));
                                        }
                                    }
                                },
                                disabledCls: ''
                            },
                            {
                                xtype: 'textfield',
                                label: 'Description',
                                labelWidth: '35%',
                                name: 'description'
                            },
                            {
                                xtype: 'numberfield',
                                labelWidth: '35%',
                                name: 'amount',
                                reference: 'amountField',
                                stepValue: 0.00,
                                label: 'Amount',
                                disabledCls: '',
                                listeners: {
                                    change: function (me, newValue, oldValue, eOpts) {
                                        var settings = TS.app.settings,
                                            mod = me.getParent().getItems().getRange()[0];

                                        if (settings.hasLoaded)
                                            mod.setValue('M');
                                        settings.hasLoaded = true;
                                    }
                                }
                            },
                            {
                                xtype: 'field-expfwalist',
                                labelWidth: '35%',
                                label: {_tr: 'fwaAbbrevLabel', tpl: '{0} #'},
                                name: 'fwaNum',
                                reference: 'fwaNumberField',
                                readOnly: true,
                                //hidden: true
                            },
                            {
                                xtype: 'textfield',
                                labelWidth: '35%',
                                label: {_tr: 'fwaAbbrevLabel', tpl: '{0} Name'},
                                reference: 'fwaNameField',
                                name: 'fwaName',
                                readOnly: true,
                                //hidden: true
                            },
                            {
                                xtype: 'container',
                                name: 'wbs1Container',
                                reference: 'wbs1Container',
                                items: [
                                    {
                                        xtype: 'button',
                                        top: '.0em',
                                        right: '.0em',
                                        iconCls: 'x-fa fa-search',
                                        handler: 'onProjectLookup',
                                        name: 'projectButton',
                                        disabled: true,
                                        disabledCls: '',
                                        hidden: true
                                    }, {
                                        label: {_tr: 'wbs1Label', tpl: '{0} #'},
                                        labelWidth: '35%',
                                        xtype: 'field-wbs',
                                        modelName: 'Wbs1',
                                        itemId: 'exp_fwawbs1id',
                                        name: 'wbs1',
                                        reference: 'wbs1combo', //we rely on referenced field selection in the view model
                                        deferredLoad: true, // Load the store until after initialization is complete
                                        clears: ['exp_fwawbs2id', 'exp_fwawbs3id', 'wbs2Label', 'wbs3Label'], //References of fields that should be receive blank value when this field sets new value
                                        sets: 'exp_fwawbs2id', //Manipulates dependent store
                                        //WBS2 needs wbs1 value
                                        dependencyFilter: {
                                            wbs1: 'exp_fwawbs1id' // Proxy ExtraParam. Will set to dependency value
                                        },
                                        app: 'EXP',
                                        listeners: {
                                            change: function (rec, newValue, oldValue, eOpts) {//'onExpWbs1Change'
                                                if (newValue) {
                                                    var fwa = rec.getStore().findRecord('id', newValue.get('id')),
                                                        wbs1Name = fwa.get('name');
                                                    rec.parent.parent.innerItems.find(o => o.referenceKey == 'wbs1name').setValue(wbs1Name);
                                                }
                                            }
                                        },
                                        disabled: true,
                                        disabledCls: ''
                                    }
                                ]
                            }, {
                                xtype: 'displayfield',
                                labelWidth: '35%',
                                userCls: 'ts-long-label',
                                label: {_tr: 'wbs1Label', tpl: '{0} Name'},
                                name: 'wbs1name',
                                reference: 'wbs1name',
                                itemId: 'wbs1NameField',
                                disabled: true,
                                disabledCls: ''
                            },
                            {
                                label: {_tr: 'wbs2Label', tpl: '{0} #'},
                                labelWidth: '35%',
                                xtype: 'field-wbs',
                                itemId: 'exp_fwawbs2id',
                                reference: 'wbs2combo',
                                clears: ['exp_fwawbs3id', 'wbs3Label'],
                                modelName: 'Wbs2',
                                name: 'wbs2',
                                app: 'FWA',
                                sets: 'exp_fwawbs3id',
                                //WBS3 needs both wbs1 and wbs2 values
                                dependencyFilter: {
                                    wbs1: 'exp_fwawbs1id',
                                    wbs2: 'exp_fwawbs2id'
                                },
                                listeners: {
                                    change: function (rec, newValue, oldValue, eOpts) { //'onExpWbsChange'
                                        if (newValue)
                                            rec.getParent().innerItems.find(o => o.referenceKey == 'wbs2name').setValue(rec.getStore().findRecord('id', newValue.get('id')).get('name'));
                                    }
                                },
                                disabledCls: ''
                            },
                            {
                                xtype: 'displayfield',
                                labelWidth: '35%',
                                itemId: 'wbs2Label',
                                userCls: 'ts-long-label',
                                label: {_tr: 'wbs2Label', tpl: '{0} Name'},
                                name: 'wbs2name',
                                reference: 'wbs2name',
                                disabledCls: ''
                            },
                            {
                                label: {_tr: 'wbs3Label', tpl: '{0} #'},
                                labelWidth: '35%',
                                xtype: 'field-wbs',
                                name: 'wbs3',
                                itemId: 'exp_fwawbs3id',
                                reference: 'wbs3combo',
                                modelName: 'Wbs3',
                                app: 'FWA',
                                listeners: {
                                    change: function (rec, newValue, oldValue, eOpts) { //'onExpWbsChange'
                                        if (newValue)
                                            rec.getParent().innerItems.find(o => o.referenceKey == 'wbs3name').setValue(rec.getStore().findRecord('id', newValue.get('id')).get('name'));
                                    }
                                },
                                disabledCls: ''
                            },
                            {
                                xtype: 'displayfield',
                                labelWidth: '35%',
                                itemId: 'wbs3Label',
                                label: {_tr: 'wbs3Label', tpl: '{0} Name'},
                                name: 'wbs3name',
                                reference: 'wbs3name'
                            }, {
                                xtype: 'field-expaccount',
                                label: 'Account',
                                reference: 'accountField',
                                itemId: 'accountField',
                                labelWidth: '35%',
                                name: 'account',
                                disabledCls: ''
                            }, {
                                xtype: 'displayfield',
                                labelWidth: '35%',
                                reference: 'accountNameField',
                                label: 'Account Name',
                                name: 'accountname',
                                disabledCls: ''
                            },
                            {
                                xtype: 'checkboxfield',
                                labelWidth: '35%',
                                name: 'billable',
                                reference: 'billableField',
                                label: 'Billable',
                                disabledCls: '',
                                listeners: {
                                    change: function (obj, newValue, oldValue, eOpts) {
                                        var settings = TS.app.settings,
                                            categoryField = obj.parent.innerItems.find(o => o.referenceKey == 'categoryEditField'),//me.lookup('categoryEditField'),
                                            categoryStore = categoryField.getStore(),
                                            categoryRecord = categoryStore.findRecord('category', categoryField.getValue()),
                                            wbs1Field = obj.parent.innerItems.find(o => o.referenceKey == 'wbs1Container').getItems().items[1],//me.lookup('wbs1combo'),
                                            wbs1Store = wbs1Field.getStore(),
                                            accountField = obj.parent.innerItems.find(o => o.referenceKey == 'accountField'),//me.lookup('accountField'),
                                            accountNameField = obj.parent.innerItems.find(o => o.referenceKey == 'accountNameField'),//me.lookup('accountNameField'),
                                            accountStore = accountField.getStore(),
                                            billableField = obj.parent.innerItems.find(o => o.referenceKey == 'billableField'),
                                            chargeType,
                                            acctRecord;

                                        //set account field
                                        if (wbs1Field.getValue() && categoryRecord) {
                                            chargeType = wbs1Store.findRecord('id', wbs1Field.getValue()).get('chargeType');
                                            accountStore.clearFilter();
                                            if (chargeType == 'R') {
                                                if (newValue) {
                                                    //accountStore.filter('useOnRegularProjects', true);
                                                    accountField.setValue(categoryRecord.get('defaultRegularBillableAccount'));
                                                    acctRecord = accountStore.findRecord('account', accountField.getValue());
                                                    accountNameField.setValue(acctRecord.get('accountName'));
                                                } else {
                                                    //accountStore.filter('useOnRegularProjects', false);
                                                    accountField.setValue(categoryRecord.get('defaultRegularNonbillableAccount'));
                                                    acctRecord = accountStore.findRecord('account', accountField.getValue());
                                                    accountNameField.setValue(acctRecord.get('accountName'));
                                                }
                                                billableField.setHidden(!settings.exDisplayBillable);
                                            } else {
                                                //accountStore.filter('useOnRegularProjects', false);
                                                accountField.setValue(categoryRecord.get('defaultNonRegularAccount'));
                                                billableField.setValue(false);
                                                billableField.setHidden(true);
                                                acctRecord = accountStore.findRecord('account', accountField.getValue());
                                                accountNameField.setValue(acctRecord.get('accountName'));
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'checkboxfield',
                                labelWidth: '35%',
                                name: 'companyPaid',
                                reference: 'companyPaidField',
                                label: 'Company Paid'
                            },
                            {
                                xtype: 'textareafield',
                                labelWidth: '35%',
                                name: 'reason',
                                label: 'Business reason </br> for expense',
                                reference: 'reasonField',
                                disabledCls: ''
                            },
                            {
                                xtype: 'textareafield',
                                labelWidth: '35%',
                                label: 'Name of each person',
                                name: 'other',
                                reference: 'otherField',
                                hidden: true,
                                disabledCls: ''
                            },
                            {
                                xtype: 'numberfield',
                                labelWidth: '35%',
                                label: 'Miles Driven',
                                name: 'miles',
                                reference: 'milesField',
                                listeners: {
                                    blur: function (obj, e) {
                                        var amountField = obj.parent.innerItems.find(o => o.referenceKey == 'amountField'),
                                            milesField = obj.parent.innerItems.find(o => o.referenceKey == 'milesField'),
                                            amountPerMileField = obj.parent.innerItems.find(o => o.referenceKey == 'amountPerMileField');
                                        //sets to 2 decimal points
                                        //amountField.setValue(Math.round((milesField.getValue() * (amountPerMileField.getValue() * .01)) * 100) / 100);
                                        amountField.setValue((milesField.getValue() * amountPerMileField.getValue() ).toFixed(2));
                                    }
                                },
                                hidden: true,
                                disabledCls: ''
                            }, {
                                xtype: 'numberfield',
                                labelWidth: '35%',
                                label: 'Mileage Rate',
                                name: 'amountPerMile',
                                readOnly: true,
                                reference: 'amountPerMileField',
                                hidden: true,
                                disabledCls: ''
                            },
                            {
                                xtype: 'button',
                                text: 'Doc',
                                iconCls: 'x-fa fa-file-text-o',
                                handler: 'onAttachExpDoc',
                                reference: 'addDocButton',
                                itemId: 'addDocButton',
                                listeners: {
                                    painted: function (el) {
                                        var ct = this.getParent().getRecord().get('attachmentCtDoc');
                                        if (ct > 0) {
                                            this.setStyle( 'background:#FF6666; color: white;' );
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                name: 'dummy',
                                text: '  ',
                                height: 300,
                                listeners: {
                                    painted: function (obj) {
                                        if (Ext.os.is.Android && Ext.os.is.Phone) {
                                            obj.hidden = false;
                                        } else {
                                            obj.hidden = true;
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    toolbarConfig: {
                        xtype: 'titlebar',
                        docked: 'top',
                        items: [{
                            xtype: 'button',
                            ui: 'decline',
                            text: 'Cancel',
                            align: 'right',
                            action: 'cancel'
                        }, {
                            xtype: 'button',
                            ui: 'confirm',
                            text: 'Save',
                            reference: 'saveButton',
                            align: 'left',
                            action: 'submit'
                        }]
                    }
                }
            ],

            columns: [
                {
                    xtype: 'datecolumn',
                    text: 'Date',
                    dataIndex: 'reportDate',
                    //renderer: renderDate,
                    // renderer: function (value, record, rec, row) {
                    //     var fn = Ext.util.Format.date;
                    //     return fn(value || new Date(), DATE_FORMAT);
                    // },
                    hidden: true
                },
                {
                    xtype: 'datecolumn',
                    cell: {
                        xtype: 'gridcell',
                        //innerCls: 'ts-multiline-cell',
                        encodeHtml: false//important to write HTML to cell
                    },
                    text: 'Date',
                    dataIndex: 'expDate',
                    renderer: renderDate,
                    flex: 1
                }, {
                    text: 'Employee',
                    dataIndex: 'empId',
                    flex: 1,
                    renderer: function (value) {
                        //all employees when displaying
                        var record = Ext.getStore('AllEmployees').getById(value);
                        return (record ? record.get('lname') + ', ' + record.get('fname') : 'N/A');
                    }
                }, {
                    text: 'Category',
                    dataIndex: 'category',
                    reference: 'categoryField',
                    flex: 1,
                    renderer: function (value) {
                        var record = Ext.getStore('ExpCategory').getById(value);
                        return (record ? record.get('description') : 'N/A');
                    }
                }
            ]
        }
    ]

});