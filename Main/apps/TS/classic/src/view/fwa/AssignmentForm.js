Ext.define('TS.view.fwa.AssignmentForm', {
    extend: 'Ext.form.Panel',
    xtype: 'form-fwa',

    requires: [
        'TS.view.fwa.EmployeeHours',
        'TS.view.fwa.Toolbar',
        'TS.view.fwa.WorkAuth'
    ],

    controller: 'form-fwa',
    reference: 'fwaForm',
    itemId: 'fwaForm',


    plugins: {
        ptype: 'printer'
    },

    layout: 'anchor',

    scrollable: true,

    autoScroll: true,

    dockedItems: [
        {
            xtype: 'toolbar-fwa',
            reference: 'fwaToolbar',
            hidden: false
        }
    ],

    items: [
        {
            xtype: 'panel',
            style: 'margin-left: 10px; margin-right: 15px;',
            items: [
                {
                    xtype: 'fieldset',
                    title: {_tr: 'fwaLabel'},
                    plugins: 'responsive',
                    responsiveConfig: {
                        small: {
                            layout: {
                                type: 'box',
                                vertical: true
                            }
                        },
                        normal: {
                            layout: {
                                type: 'box',
                                vertical: false
                            }
                        }
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            flex: 1,
                            name: 'fwaNum',
                            fieldLabel: {_tr: 'fwaAbbrevLabel', tpl: '{0} #'},
                            bind: {
                                readOnly: '{settings.fwaAutoNumbering}'
                            },
                            reference: 'fwaNumField',
                            itemId: 'fwaNumField'
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'textfield',
                            flex: 1,
                            name: 'fwaName',
                            fieldLabel: {_tr: 'fwaAbbrevLabel', tpl: '{0} Name'},
                            reference: 'fwaNameField'
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'checkboxfield',
                            name: 'availableForUseInField',
                            boxLabel: 'Available?',
                            boxLabelAlign: 'before',
                            reference: 'availableCheckbox',
                            margin: '0 30 0 30',
                            bind: {
                                hidden: '{!isScheduler}'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'displayfield',
                            name: 'fwaStatusString',
                            flex: 1,
                            fieldLabel: 'Status',
                            labelAlign: 'right'
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'field-prioritylist',
                            fieldLabel: {_tr: 'fieldPriorityLabel', tpl: '{0}'},
                            name: 'fieldPriorityId',
                            reference: 'fieldPriorityField',
                            itemId: 'fieldPriorityField',
                            labelAlign: 'right',
                            hidden: true
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'button',
                            width: 24,
                            reference: 'fwaInstructionsButton',
                            itemId: 'fwaInstructionsButton',
                            iconCls: 'x-fa fa-folder yellowIcon',
                            tooltip: {_tr: 'fwaAbbrevLabel', tpl: 'Click to view {0} notes'},
                            handler: 'loadFwaNotes'
                        },
                        {
                            xtype: 'button',
                            width: 24,
                            reference: 'fwaInstructionsButtonFull',
                            itemId: 'fwaInstructionsButtonFull',
                            iconCls: 'x-fa fa-folder-open yellowIcon',
                            tooltip: {_tr: 'fwaAbbrevLabel', tpl: 'Click to view {0} notes'},
                            handler: 'loadFwaNotes',
                            style: 'background: red',
                            hidden: true
                        },
                        {
                            xtype: 'fixedspacer'
                        }
                    ]
                },
            ]
        },
        {
            xtype: 'panel',
            style: 'margin-left: 10px; margin-right: 15px;',
            items: [
                {
                    xtype: 'fieldset-fwainfo',
                    // userCls: 'big-100 small-100'
                }
            ]
        },

        {
            xtype: 'panel',
            style: 'margin-left: 10px; margin-right: 15px;',
            reference: 'addressDatePanel',
            layout: 'fit',
            title: 'Work Address and Dates & Times',
            bind: {
                //hidden: '{addressDatePanel}'
            },
            collapsible: true,
            items: [
                {
                    xtype: 'fieldcontainer',
                    flex: 1,
                    plugins: 'responsive',
                    responsiveConfig: {
                        small: {
                            layout: {
                                type: 'box',
                                align: 'stretch',
                                vertical: true
                            }
                        },
                        normal: {
                            layout: {
                                type: 'box',
                                align: 'stretch',
                                vertical: false
                            }
                        }
                    },
                    items: [
                        {
                            xtype: 'fieldset-address',
                            flex: 1
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'fieldset-datetime',
                            reference: 'fwaDateTimeFieldset',
                            flex: 1
                            //userCls: 'big-50 small-100'
                        }
                    ]
                }
            ],
            listeners: {
                expand: function (p) {
                    localStorage.setItem('addressDatePanelOpen', true);
                },
                collapse: function (p) {
                    localStorage.setItem('addressDatePanelOpen', false);
                }
            }
        },

        {
            xtype: 'panel',
            style: 'margin-left: 10px; margin-right: 15px;',
            reference: 'workCodeUnitPanel',
            layout: 'fit',
            collapsible: true,
            bind: {
                hidden: '{hideWorkCodeUnitPanel}'
            },
            items: [
                {
                    xtype: 'fieldcontainer',
                    flex: 1,
                    plugins: 'responsive',
                    responsiveConfig: {
                        small: {
                            layout: {
                                type: 'box',
                                align: 'stretch',
                                vertical: true
                            }
                        },
                        normal: {
                            layout: {
                                type: 'box',
                                align: 'stretch',
                                vertical: false
                            }
                        }
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            reference: 'workCodeGrid',
                            title: {_tr: 'workCodeLabelPlural'},
                            //minHeight: 250,
                            flex: 1,
                            items: {
                                xtype: 'grid-workauth',
                                itemId: 'workCodeGrid'
                            },
                            bind: {
                                hidden: '{fwaHideWorkCodes}'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'fieldset',
                            reference: 'unitCodeGrid',
                            title: {_tr: 'unitLabelPlural', tpl: '{0}'},
                            //minHeight: 250,
                            flex: 1,
                            items: [
                                {
                                    xtype: 'toolbar',
                                    style: 'background: #e6e6e6 !important; padding: 2px 0 2px 6px !important;',
                                    itemId: 'unitsDateToolbar',
                                    reference: 'unitsDateBar',
                                    layout: {
                                        pack: 'center'
                                    },
                                    dock: 'top',
                                    items: [
                                        {
                                            iconCls: 'x-fa fa-arrow-left',
                                            handler: 'lastUnitDate',
                                            reference: 'lastUnitDate',
                                            itemId: 'lastUnitDate',
                                            align: 'left',
                                            height: 40
                                        },
                                        {
                                            xtype: 'datefield',
                                            disabled: true,
                                            disabledCls: '',
                                            reference: 'unitDateHeader',
                                            fieldStyle: 'font-weight: bold;font-size: 12pt; padding-left: 50px;',
                                            itemId: 'unitDateHeader',
                                            cls: 'mydate-display',
                                            style: 'text-align: right;',
                                            listeners: {
                                                //change: 'onUnitsDateHeaderChange'
                                            }
                                        },
                                        {
                                            iconCls: 'x-fa fa-arrow-right',
                                            handler: 'nextUnitDate',
                                            reference: 'nextUnitDate',
                                            itemId: 'nextUnitDate',
                                            align: 'right',
                                            height: 40
                                        },
                                        {
                                            text: 'Add Date',
                                            handler: 'addUnitDate',
                                            reference: 'addUnitDateBtn',
                                            height: 40,
                                            cls: 'mydate-display',
                                            hidden: true
                                        }
                                    ]
                                },
                                {
                                    xtype: 'grid-unit'
                                }
                            ],
                            bind: {
                                hidden: '{!fwaUnitsEnabled}'
                            }
                        }
                    ]
                }
            ],
            listeners: {
                expand: function (p) {
                    localStorage.setItem('workCodeUnitPanelOpen', true);

                },
                collapse: function (p) {
                    localStorage.setItem('workCodeUnitPanelOpen', false);
                }
            }
        },
        {
            xtype: 'panel',
            style: 'background-color: #4286b4 !important;margin-left: 10px; margin-bottom: 5px; margin-right: 15px;',
            reference: 'empHoursPanel',
            layout: 'fit',
            title: 'Employee Hours',
            collapsible: true,
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            xtype: 'toolbar',
                            cls: 'toolbar-header',
                            style: 'background: #e6e6e6 !important; padding: 2px 0 2px 6px !important;',
                            itemId: 'workCodeDateToolbar',
                            reference: 'workCodeDateBar',
                            layout: {
                                pack: 'center'
                            },
                            dock: 'top',
                            items: [
                                {
                                    iconCls: 'x-fa fa-arrow-left',
                                    handler: 'lastDate',
                                    reference: 'lastDate',
                                    itemId: 'lastDate',
                                    align: 'left',
                                    height: 40
                                },
                                {
                                    xtype: 'datefield',
                                    reference: 'dateHeader',
                                    fieldStyle: 'font-weight: bold;font-size: 12pt;padding-left: 50px;',
                                    readOnly: true,
                                    disabled: true,
                                    disabledCls: '',
                                    itemId: 'dateHeader',
                                    cls: 'mydate-display',
                                    style: 'text-align: right;',
                                    listeners: {}
                                },
                                {
                                    iconCls: 'x-fa fa-arrow-right',
                                    handler: 'nextDate',
                                    reference: 'nextDate',
                                    itemId: 'nextDate',
                                    align: 'right',
                                    height: 40
                                },
                                {
                                    text: 'Add Date',
                                    handler: 'addWorkDate',
                                    reference: 'addWorkDateBtn',
                                    height: 40,
                                    cls: 'mydate-display',
                                    hidden: true
                                }
                            ]
                        },
                        {
                            xtype: 'grid-employeehours'
                        }
                    ]
                }
            ],

            listeners: {
                expand: function (p) {
                    localStorage.setItem('empHoursPanelOpen', true);
                },
                collapse: function (p) {
                    localStorage.setItem('empHoursPanelOpen', false);
                }
            }
        },
        {
            xtype: 'panel',
            style: 'margin-left: 10px; margin-bottom: 5px; margin-right: 15px;',
            reference: 'expensesPanel',
            layout: 'fit',
            title: 'Employee Expenses',
            collapsible: true,
            bind: {
                hidden: '{hideExpenses}'
            },
            items: [
                {
                    xtype: 'grid-employeeexpenses'
                }
            ],
            listeners: {
                expand: function (p) {
                    localStorage.setItem('expensesPanelOpen', true);
                },
                collapse: function (p) {
                    localStorage.setItem('expensesPanelOpen', false);
                }
            }
        },
        {
            xtype: 'panel',
            style: 'margin-left: 10px; margin-right: 15px;',
            reference: 'signaturePanel',
            layout: 'fit',
            title: 'Signatures',
            bind: {
                hidden: '{hideSignaturePanel}'
            },
            collapsible: true,
            items: [
                {
                    xtype: 'fieldcontainer',
                    flex: 1,
                    plugins: 'responsive',
                    responsiveConfig: {
                        small: {
                            layout: {
                                type: 'box',
                                align: 'stretch',
                                vertical: true
                            }
                        },
                        normal: {
                            layout: {
                                type: 'box',
                                align: 'stretch',
                                vertical: false
                            }
                        }
                    },
                    items: [
                        {
                            xtype: 'panel',
                            flex: 1,
                            items: [
                                {
                                    xtype: 'fieldset-approval',
                                    reference: 'fwaClientApprovalFieldset',
                                    bind: {
                                        title: 'Manage {settings.clientLabel} Signature {clientSigReqTxt}'
                                    },
                                    signatureType: 'S',
                                    attachmentId: null
                                }
                            ],
                            bind: {
                                hidden: '{hideFwaClientSignatures}'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'panel',
                            flex: 1,
                            items: [
                                {
                                    xtype: 'fieldset-approval',
                                    reference: 'fwaChiefApprovalFieldset',
                                    bind: {
                                        title: 'Manage {settings.crewChiefLabel} Signature {chiefSigReqTxt}'
                                    },
                                    signatureType: 'E',
                                    attachmentId: null,
                                    //userCls: 'big-25 small-100'
                                }
                            ],
                            bind: {
                                hidden: '{hideFwaChiefSignatures}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'fieldset-approvalsetup',
                    flex: 1,
                    reference: 'fwaApprovalSetupFieldset'
                    // userCls: 'big-25 small-100'
                }
            ],
            listeners: {
                expand: function (p) {
                    localStorage.setItem('signaturePanelOpen', true);
                },
                collapse: function (p) {
                    localStorage.setItem('signaturePanelOpen', false);
                }
            }
        },
        {
            // Hidden fields
            xtype: 'hiddenfield',
            readOnly: true,
            name: 'fwaId'
        }
    ],

    listeners: {
        hide: 'onFwaFormHide', //TODO Double check on usage
        expand: function (p) {
            p.getForm().dirty = false;
        }
    }
});
//298

