Ext.define('TS.view.main.FWAEditOffline', {
    extend: 'Ext.form.Panel',
    xtype: 'fwa-edit-offline',

    requires: [
        'Ext.SegmentedButton',
        'Ext.field.TextArea',
        'TS.common.field.WBS'
    ],

    controller: 'fwa-edit',
    reference: 'fwaEditForm-Offline',
    itemId: 'fwaForm-Offline',

    scrollable: 'y', //limit scrolling to vertical axis
    items: [
        {
            xtype: 'titlebar',
            cls: 'ts-navigation-header',
            docked: 'top',
            title: 'Edit',
            items: [
                {
                    xtype: 'button',
                    text: 'Back',
                    iconCls: 'x-fa fa-chevron-left',
                    action: 'navigation-back',
                    reference: 'backButton'
                },
                {
                    align: 'right',
                    iconCls: 'x-fa fa-bars',
                    handler: 'onEditMenuOfflineTap',
                    reference: 'fwaEditMenuButton'
                }
            ]
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    text: 'Save',
                    align: 'right',
                    ui: 'action',
                    iconCls: 'x-fa fa-save',
                    handler: 'onSaveFwa',
                    style: 'margin-right: 5px;',
                    reference: 'saveFwaButton'
                },
                {
                    text: 'Submit',
                    align: 'right',
                    ui: 'action',
                    iconCls: 'x-fa fa-save',
                    handler: 'onSubmitFwa',
                    reference: 'submitFwaButton'
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: {_tr: 'fwaLabel'},
            items: [
                {
                    xtype: 'textfield',
                    hidden: true,
                    bind: '{selectedFWA.fwaId}'
                },
                {
                    xtype: 'textfield',
                    reference: 'fwaNumField',
                    label: {_tr: 'fwaAbbrevLabel', tpl: '{0} #'},
                    bind: {
                        readOnly: '{settings.fwaAutoNumbering}',
                        value: '{selectedFWA.fwaNum}'
                    }
                },
                {
                    xtype: 'textfield',
                    label: {_tr: 'fwaAbbrevLabel', tpl: '{0} Name'},
                    reference: 'fwaNameField',
                    bind: '{selectedFWA.fwaName}'
                },
                {
                    xtype: 'displayfield',
                    label: 'Status',
                    bind: '{selectedFWA.fwaStatusString}'
                },
                {
                    xtype: 'field-prioritylist',
                    label: 'Field Priority',
                    itemId: 'fieldPriorityField',
                    //autoSelect: true,
                    placeHolder: 'Select priority',
                    bind: {
                        value: '{selectedFWA.fieldPriorityId}',
                        readOnly: '{wbsLocked}',
                        style: '{selectedFWA.fieldPriorityColor}'
                    }
                },
                {
                    xtype: 'button',
                    handler: 'onManageNotesTap',
                    bind: {
                        iconCls: '{notesCls}'
                    },
                    text: 'Notes',
                    cls: 'ts-bt-margin-small',
                    reference: 'notesButton'
                },
                {
                    xtype: 'button',
                    text: 'Non-field Actions',
                    // top: '-0.1em', //used only if in a container
                    // right: '1em',
                    iconCls: 'x-fa fa-list-ol',
                    cls: 'ts-bt-margin-small',
                    handler: 'onActionLookup',
                    reference: 'nonFieldActionsButton'
                }
            ]
        },

        // {
        //     xtype: 'container',
        //     items: [
        //         {
        //             xtype: 'button',
        //             top: '-0.6em',
        //             right: '1em',
        //             iconCls: 'x-fa fa-search',
        //             handler: 'onProjectLookup',
        //             bind: {
        //                 disabled: '{wbsLocked}',
        //                 hidden: IS_OFFLINE
        //             }
        //         }
        //     ]
        // },
        {
            xtype: 'fieldset',
            title: 'General Information',
            reference: 'offlineGeneralInformation',
            items: [
                {
                    xtype: 'displayfield',
                    label: {_tr: 'wbs1Label', tpl: '{0} #'},
                    bind: {
                        value: '{selectedFWA.wbs1}',
                        hidden: '{hideFwaWbs1}'
                    }
                },
                {
                    xtype: 'displayfield',
                    label: {_tr: 'wbs2Label', tpl: '{0} #'},
                    bind: {
                        value: '{selectedFWA.wbs2}',
                        hidden: '{hideFwaWbs2}'
                    }
                },
                {
                    xtype: 'displayfield',
                    label: {_tr: 'wbs3Label', tpl: '{0} #'},
                    bind: {
                        value: '{selectedFWA.wbs3}',
                        hidden: '{hideFwaWbs3}'
                    }
                },
                {
                    xtype: 'displayfield',
                    userCls: 'ts-long-label',
                    label: {_tr: 'wbs1Label', tpl: '{0} Name'},
                    bind: {
                        value: '{selectedFWA.wbs1Name}',
                        hidden: '{hideFwaWbs1}'
                    }
                },
                {
                    xtype: 'displayfield',
                    userCls: 'ts-long-label',
                    label: {_tr: 'wbs2Label', tpl: '{0} Name'},
                    bind: {
                        value: '{selectedFWA.wbs2Name}',
                        hidden: '{hideFwaWbs2}'
                    }
                },
                {
                    xtype: 'displayfield',
                    label: {_tr: 'wbs3Label', tpl: '{0} Name'},
                    bind: {
                        value: '{selectedFWA.wbs3Name}',
                        hidden: '{hideFwaWbs3}'
                    }
                },
                {
                    xtype: 'displayfield',
                    userCls: 'ts-long-label',
                    reference: 'clientNameField',
                    label: {_tr: 'clientLabel', tpl: '{0} Name'},
                    bind: {
                        value: '{wbs1combo.selection.clientName}',
                        hidden: '{hideFwaDisplayClient}'
                    }
                },
                {
                    xtype: 'field-schedulers',
                    label: 'Scheduled By',
                    itemId: 'scheduledByField',
                    bind: {
                        value: '{selectedFWA.preparedByEmpId}',
                        readOnly: '{wbsLocked}'
                    }
                },
                {
                    xtype: 'textfield',
                    label: {_tr: 'contactLabel'},
                    reference: 'contactField',
                    bind: '{selectedFWA.contactInfo}'
                },
                {
                    xtype: 'segmentedbutton',
                    cls: 'filterbar-segmented-button',
                    pressedCls: 'filterbar-segmented-button-pressed',
                    allowMultiple: true,
                    items: [
                        {
                            text: {_tr: 'crewLabelPlural', tpl: 'All {0}'},
                            handler: 'onAllCrewsClick',
                            iconCls: 'user',
                            itemId: 'allCrewButton',
                            width: '50%'

                        },
                        {
                            text: {_tr: 'crewLabelPlural', tpl: 'My {0} Only'},
                            width: '50%',
                            itemId: 'myCrewsButton',
                            iconCls: 'compose',
                            handler: 'onMyCrewOnlyClick',
                            pressed: true,
                            style: 'color:white;background-color:#939393;font-weight: bold;'
                        }
                    ],
                    bind: {
                        hidden: '{!newFwa}'
                    }
                },
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-phone',
                            itemId: 'crewPhoneButton',
                            handler: 'onCrewPhoneClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{newFwa}'
                            }
                        },
                        {
                            xtype: 'field-crewlist',
                            label: {_tr: 'crewLabel'},
                            itemId: 'crewLabel',
                            reference: 'schedCrewfield',
                            bind: {
                                value: '{selectedFWA.scheduledCrewId}',
                                readOnly: '{!newFwa}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-file-o',
                            itemId: 'udf_t1',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_t1}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            label: {_tr: 'udf_t1_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t1}',
                                hidden: '{hideUdf_t1}',
                                readOnly: '{readOnlyUdf_t1}'
                            },
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getParent().getScrollable();
                                    TS.app.settings.currentPosition = scroller.position.y;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 700);
                                },
                                blur: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getParent().getScrollable();
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, TS.app.settings.currentPosition);
                                }
                            }
                        }
                    ],
                    bind: {
                        hidden: '{!hasUdfT1}'
                    }
                },
                {
                    xtype: 'checkboxfield',
                    label: 'Contract?',
                    itemId: 'isContractWorkCbx',
                    bind: {
                        checked: '{selectedFWA.isContractWork}',
                        disabled: '{!newFwa}'
                    }
                },
                {
                    xtype: 'checkboxfield',
                    label: {_tr: 'udf_c1_Label'},
                    itemId: 'udf_c1_cbx',
                    bind: {
                        checked: '{selectedFWA.udf_c1}',
                        disabled: '{readOnlyUdf_c1}',
                        hidden: '{hideUdf_c1}'
                    },
                    disabledCls: '',
                    listeners:{
                        change: 'udfCheckBoxChange'
                    }
                },
                {
                    xtype: 'checkboxfield',
                    label: 'WBS Locked',
                    itemId: 'wbsLockedCbx',
                    reference: 'wbsLockedCbx',
                    bind: {
                        checked: '{selectedFWA.wbsLocked}',
                        hidden: '{!newFwa}'
                    }
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-file-o',
                            itemId: 'udf_t2',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_t2}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            label: {_tr: 'udf_t2_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t2}',
                                hidden: '{hideUdf_t2}',
                                readOnly: '{readOnlyUdf_t2}'
                            },
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getParent().getScrollable();
                                    TS.app.settings.currentPosition = scroller.position.y;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 700);
                                },
                                blur: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getParent().getScrollable();
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, TS.app.settings.currentPosition);
                                }
                            }
                        }
                    ],
                    bind: {
                        hidden: '{!hasUdfT1}'
                    }
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-file-o',
                            itemId: 'udf_t3',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_t3}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            label: {_tr: 'udf_t3_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t3}',
                                hidden: '{hideUdf_t3}',
                                readOnly: '{readOnlyUdf_t3}'
                            },
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getParent().getScrollable();
                                    TS.app.settings.currentPosition = scroller.position.y;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 700);
                                },
                                blur: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getParent().getScrollable();
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, TS.app.settings.currentPosition);
                                }
                            }
                        }
                    ],
                    bind: {
                        hidden: '{!hasUdfT1}'
                    }
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-file-o',
                            itemId: 'udf_t4',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_t4}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            label: {_tr: 'udf_t4_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t4}',
                                hidden: '{hideUdf_t4}',
                                readOnly: '{readOnlyUdf_t4}'
                            },
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getParent().getScrollable();
                                    TS.app.settings.currentPosition = scroller.position.y;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 700);
                                },
                                blur: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getParent().getScrollable();
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, TS.app.settings.currentPosition);
                                }
                            }
                        }
                    ],
                    bind: {
                        hidden: '{!hasUdfT1}'
                    }
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-file-o',
                            itemId: 'udf_t5',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_t5}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            label: {_tr: 'udf_t5_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t5}',
                                hidden: '{hideUdf_t5}',
                                readOnly: '{readOnlyUdf_t5}'
                            },
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getParent().getScrollable();
                                    TS.app.settings.currentPosition = scroller.position.y;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 700);
                                },
                                blur: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getParent().getScrollable();
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, TS.app.settings.currentPosition);
                                }
                            }
                        }
                    ],
                    bind: {
                        hidden: '{!hasUdfT1}'
                    }
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-file-o',
                            itemId: 'udf_t6',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em', bind: {
                                hidden: '{readOnlyUdf_t6}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            label: {_tr: 'udf_t6_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t6}',
                                hidden: '{hideUdf_t6}',
                                readOnly: '{readOnlyUdf_t6}'
                            },
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getParent().getScrollable();
                                    TS.app.settings.currentPosition = scroller.position.y;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 700);
                                },
                                blur: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getParent().getScrollable();
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, TS.app.settings.currentPosition);
                                }
                            }
                        }
                    ],
                    bind: {
                        hidden: '{!hasUdfT1}'
                    }
                }, {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-file-o',
                            itemId: 'udf_t7',
                            handler: 'onUdfClick',
                            top: '.0em',
                            right: '.0em',
                            bind: {
                                hidden: '{readOnlyUdf_t7}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            label: {_tr: 'udf_t7_Label'},
                            bind: {
                                value: '{selectedFWA.udf_t7}',
                                hidden: '{hideUdf_t7}',
                                readOnly: '{readOnlyUdf_t7}'
                            },
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getParent().getScrollable();
                                    TS.app.settings.currentPosition = scroller.position.y;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 700);
                                },
                                blur: function (obj, e) {
                                    var scroller = obj.getParent().getParent().getParent().getScrollable();
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, TS.app.settings.currentPosition);
                                }
                            }
                        }
                    ],
                    bind: {
                        hidden: '{!hasUdfT1}'
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Work Address',
            items: [
                {
                    xtype: 'textfield',
                    label: 'Address 1',
                    bind: '{selectedFWA.loc.address1}',
                    itemId: 'address1Field',
                    reference: 'address1Field',
                    listeners: {
                        focus: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            TS.app.settings.currentPosition = scroller.position.y;
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, 835);
                        },
                        blur: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, TS.app.settings.currentPosition);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    label: 'Address 2',
                    bind: '{selectedFWA.loc.address2}',
                    itemId: 'address2Field',
                    reference: 'address2Field',
                    listeners: {
                        focus: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            TS.app.settings.currentPosition = scroller.position.y;
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, 885);
                        },
                        blur: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, TS.app.settings.currentPosition);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    label: 'City',
                    bind: '{selectedFWA.loc.city}',
                    itemId: 'cityField',
                    reference: 'cityField',
                    listeners: {
                        focus: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            TS.app.settings.currentPosition = scroller.position.y;
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, 935);
                        },
                        blur: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, TS.app.settings.currentPosition);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    label: 'State',
                    bind: '{selectedFWA.loc.state}',
                    itemId: 'stateField',
                    reference: 'stateField',
                    listeners: {
                        focus: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            TS.app.settings.currentPosition = scroller.position.y;
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, 985);
                        },
                        blur: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, TS.app.settings.currentPosition);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    label: 'Zip',
                    bind: '{selectedFWA.loc.zip}',
                    itemId: 'zipField',
                    reference: 'zipField',
                    listeners: {
                        focus: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            TS.app.settings.currentPosition = scroller.position.y;
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, 1035);
                        },
                        blur: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, TS.app.settings.currentPosition);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    label: 'Latitude',
                    reference: 'locLatitude',
                    bind: '{selectedFWA.loc.latitude}',
                    itemId: 'latitudeField',
                    listeners: {
                        focus: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            TS.app.settings.currentPosition = scroller.position.y;
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, 1085);
                        },
                        blur: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, TS.app.settings.currentPosition);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    label: 'Longitude',
                    reference: 'locLongitude',
                    bind: '{selectedFWA.loc.longitude}',
                    itemId: 'longitudeField',
                    listeners: {
                        focus: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            TS.app.settings.currentPosition = scroller.position.y;
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, 1135);
                        },
                        blur: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, TS.app.settings.currentPosition);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    label: {_tr: 'udf_a1_Label'},
                    reference: 'udf_a1_field',
                    bind: {
                        value: '{selectedFWA.udf_a1}',
                        hidden: '{hideUdf_a1}',
                        readOnly: '{readOnlyUdf_a1}'
                    },
                    itemId: 'udf_a1_field',
                    listeners: {
                        focus: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            TS.app.settings.currentPosition = scroller.position.y;
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, 1135);
                        },
                        blur: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, TS.app.settings.currentPosition);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    label: {_tr: 'udf_a2_Label'},
                    reference: 'udf_a2_field',
                    bind: {
                        value: '{selectedFWA.udf_a2}',
                        hidden: '{hideUdf_a2}',
                        readOnly: '{readOnlyUdf_a2}'
                    },
                    itemId: 'udf_a2_field',
                    listeners: {
                        focus: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            TS.app.settings.currentPosition = scroller.position.y;
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, 1135);
                        },
                        blur: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, TS.app.settings.currentPosition);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    label: {_tr: 'udf_a3_Label'},
                    reference: 'udf_a3_field',
                    bind: {
                        value: '{selectedFWA.udf_a3}',
                        hidden: '{hideUdf_a3}',
                        readOnly: '{readOnlyUdf_a3}'
                    },
                    itemId: 'udf_a3_field',
                    listeners: {
                        focus: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            TS.app.settings.currentPosition = scroller.position.y;
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, 1135);
                        },
                        blur: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, TS.app.settings.currentPosition);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    label: {_tr: 'udf_a4_Label'},
                    reference: 'udf_a4_field',
                    bind: {
                        value: '{selectedFWA.udf_a4}',
                        hidden: '{hideUdf_a4}',
                        readOnly: '{readOnlyUdf_a4}'
                    },
                    itemId: 'udf_a4_field',
                    listeners: {
                        focus: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            TS.app.settings.currentPosition = scroller.position.y;
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, 1135);
                        },
                        blur: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, TS.app.settings.currentPosition);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    label: {_tr: 'udf_a5_Label'},
                    reference: 'udf_a5_field',
                    bind: {
                        value: '{selectedFWA.udf_a5}',
                        hidden: '{hideUdf_a5}',
                        readOnly: '{readOnlyUdf_a5}'
                    },
                    itemId: 'udf_a5_field',
                    listeners: {
                        focus: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            TS.app.settings.currentPosition = scroller.position.y;
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, 1135);
                        },
                        blur: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, TS.app.settings.currentPosition);
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    label: 'UDF A6', //{_tr: 'udf_a6_Label'},
                    reference: 'udf_a6_field',
                    bind: {
                        value: '{selectedFWA.udf_a6}',
                        hidden: '{hideUdf_a6}',
                        readOnly: '{readOnlyUdf_a6}'
                    },
                    itemId: 'udf_a6_field',
                    listeners: {
                        focus: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            TS.app.settings.currentPosition = scroller.position.y;
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, 1135);
                        },
                        blur: function (obj, e) {
                            var scroller = obj.getParent().getParent().getScrollable();
                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                scroller.scrollTo(null, TS.app.settings.currentPosition);
                        }
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Dates & Times',
            items: [
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            top: '.0em',
                            right: '.0em',
                            iconCls: 'x-fa  fa-refresh',
                            handler: 'onResetOrderedDates',
                            itemId: 'resetOrderedDatesBtn',
                            bind: {
                                disabled: '{wbsLocked}'
                            }
                        },
                        {
                            xtype: 'datepickerfield',
                            label: 'Date Ordered',
                            itemId: 'dateOrderedField',
                            reference: 'dateOrderedField',
                            bind: '{selectedFWA.dateOrdered}',
                            picker: {
                                yearFrom: 2017,
                                yearTo: new Date().getFullYear() + 2
                            }
                        }
                    ]
                },
                {
                    xtype: 'field-employee',
                    label: 'Ordered By',
                    itemId: 'orderedByField',
                    bind: '{selectedFWA.orderedBy}'
                },
                {
                    xtype: 'datepickerfield',
                    label: 'Date Required',
                    itemId: 'dateRequiredField',
                    reference: 'dateRequiredField',
                    bind: '{selectedFWA.dateRequired}',
                    picker: {
                        yearFrom: 2015,
                        yearTo: new Date().getFullYear() + 2
                    }
                },
                {
                    xtype: 'datepickerfield',
                    label: {_tr: 'udf_d1_Label'},
                    itemId: 'udf_d1_field',
                    reference: 'udf_d1_field',
                    bind: {
                        value: '{selectedFWA.udf_d1}',
                        hidden: '{hideUdf_d1}',
                        readOnly: '{readOnlyUdf_d1}'
                    },
                    picker: {
                        yearFrom: 2015,
                        yearTo: new Date().getFullYear() + 2
                    }
                },
                {
                    xtype: 'datepickerfield',
                    label: {_tr: 'udf_d2_Label'},
                    itemId: 'udf_d2_field',
                    reference: 'udf_d2_field',
                    bind: {
                        value: '{selectedFWA.udf_d2}',
                        hidden: '{hideUdf_d2}',
                        readOnly: '{readOnlyUdf_d2}'
                    },
                    picker: {
                        yearFrom: 2015,
                        yearTo: new Date().getFullYear() + 2
                    }
                },
                {
                    xtype: 'datepickerfield',
                    label: {_tr: 'udf_d3_Label'},
                    itemId: 'udf_d3_field',
                    reference: 'udf_d3_field',
                    bind: {
                        value: '{selectedFWA.udf_d3}',
                        hidden: '{hideUdf_d3}',
                        readOnly: '{readOnlyUdf_d3}'
                    },
                    picker: {
                        yearFrom: 2015,
                        yearTo: new Date().getFullYear() + 2
                    }
                },
                {
                    xtype: 'container',
                    style: 'border-bottom: 1px solid #d0d0d0;',
                    items: [
                        {
                            xtype: 'button',
                            top: '.0em',
                            right: '.0em',
                            iconCls: 'x-fa  fa-refresh',
                            handler: 'onResetDates',
                            itemId: 'resetDatesBtn',
                            bind: {
                                disabled: '{wbsLocked}'
                            }
                        },
                        {
                            xtype: 'datepickerfield',
                            label: 'Start Date',
                            itemId: 'schedStartDateField',
                            reference: 'schedStartDateField',
                            bind: '{selectedFWA.schedStartDate}',
                            //Example set year slot range
                            picker: {
                                yearFrom: 2015,
                                yearTo: new Date().getFullYear() + 2
                            },
                            dateFormat: 'n/j/Y',
                            listeners: {
                                change: 'onStartDateChange'
                            }
                        }
                    ]
                },
                {
                    xtype: 'timepickerfield',
                    label: 'Start Time',
                    reference: 'schedStartTimeField',
                    itemId: 'schedStartTimeField',
                    bind: '{selectedFWA.schedStartDate}',
                    dateFormat: 'g:i A'
                },
                {
                    xtype: 'datepickerfield',
                    label: 'End Date',
                    bind: '{selectedFWA.schedEndDate}',
                    itemId: 'schedEndDateField',
                    reference: 'schedEndDateField',
                    //readOnly: true,
                    picker: {
                        yearFrom: 2015,
                        yearTo: new Date().getFullYear() + 2
                    },
                    dateFormat: 'n/j/Y',
                    listeners: {
                        change: 'onEndDateChange'
                    }
                },
                {
                    xtype: 'timepickerfield',
                    label: 'End Time',
                    bind: '{selectedFWA.schedEndDate}',
                    itemId: 'schedEndTimeField',
                    reference: 'schedEndTimeField',
                    dateFormat: 'g:i A'
                }
            ],
            listeners: {
                painted: function () {
                    var me = this,
                        settings = TS.app.settings,
                        vm = Ext.first('app-fwa').getViewModel(),
                        selection = vm.get('selectedFWA');

                    if (selection.get('recurrencePattern')) {
                        me.setTitle('Dates & Times (*recurring)');
                    } else {
                        me.setTitle('Dates & Times');
                    }
                }
            }
        },

        {
            xtype: 'fieldset',
            reference: 'workCodeUnitFieldset',
            bind: {
                title: '{settings.workCodeLabelPlural}'
            },
            cls: 'ts-fieldset-nbr',
            items: [
                {
                    xtype: 'button',
                    handler: 'onManageWorkCodesTap',
                    text: {_tr: 'workCodeLabelPlural', tpl: '{0}'},
                    reference: 'manageWorkCodeButton',
                    bind: {
                        hidden: '{fwaHideWorkCodes}'
                    }
                },
                {
                    xtype: 'button',
                    handler: 'onManageUnitsTap',
                    text: {_tr: 'unitLabelPlural', tpl: '{0}'},
                    reference: 'manageUnitsButton',
                    bind: {
                        hidden: '{!fwaUnitsEnabled}'
                    }
                },
                {
                    xtype: 'button',
                    handler: 'onManageHoursTap',
                    text: 'Employee Hours',
                    reference: 'manageHoursButton'
                },
                {
                    xtype: 'button',
                    handler: 'onManageExpensesTap',
                    text: 'Employee Expenses',
                    reference: 'manageExpensesButton',
                    bind: {
                        hidden: '{hideExpenses}'
                    }
                }
            ]
        },
        {
            xtype: 'fieldset',
            title: 'Approval Requirements',
            items: [
                {
                    xtype: 'checkboxfield',
                    bind: '{selectedFWA.clientSigReq}',
                    label: {_tr: 'clientLabel', tpl: '{0} Signature'},
                    reference: 'clientReqCheckBox'
                },
                {
                    xtype: 'checkboxfield',
                    bind: '{selectedFWA.chiefSigReq}',
                    label: {_tr: 'crewChiefLabel', tpl: '{0} Signature'},
                    reference: 'chiefReqCheckBox'
                }
            ],
            bind: {
                hidden: '{!newFwa}'
            }
        },
        {
            xtype: 'fieldset',
            userCls: 'ts-required-field',
            itemId: 'signatureFields',
            bind: {
                title: 'Signatures',// '{settings.clientLabel} Signature {clientSigReqTxt}',
                hidden: '{hideSignaturePanel}'
            },
            items: [
                {
                    xtype: 'container',
                    itemId: 'fwaClientSignatures',
                    bind: {
                        hidden: '{hideFwaClientSignatures}'
                    },
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-remove',
                            itemId: 'deleteClientSignatureButton',
                            handler: 'onDeleteClientSignatureClick',
                            top: '2.8em',
                            right: '.0em',
                            bind: {
                                //hidden: '{newFwa}'
                            }
                        },
                        {
                            xtype: 'segmentedbutton',
                            allowMultiple: true,
                            items: [
                                {
                                    cls: 'ts-bt-margin-small',
                                    text: {_tr: 'clientLabel', tpl: 'Manage {0} Signature'},
                                    handler: 'onManageClientApproval',
                                    reference: 'clientApprovalButton',
                                    itemId: 'clientApprovalButton',
                                    width: '75%'
                                },
                                {
                                    text: 'View All',
                                    width: '25%',
                                    handler: 'viewAllClientSignatures',
                                    itemId: 'viewAllClientSignatureButton'

                                }
                            ]
                        },
                        {
                            xtype: 'image',
                            reference: 'clientApprovalImage',
                            itemId: 'clientApprovalImage',
                            attachmentId: null,
                            height: 75,
                            hidden: true
                        },
                        {
                            xtype: 'textfield',
                            userCls: 'ts-long-label',
                            itemId: 'clientApprovalDate',
                            label: 'Signature Date',
                            bind: '{selectedFWA.clientApprovalDate}',
                            dateFormat: 'n/j/Y',
                            component: {
                                useMask: false // This removes the trigger on the right side of the field that usually populates the picker
                            },
                            readOnly: true // this ensures that field is not grayed out but no edit is allowed
                        },
                        {
                            xtype: 'container',
                            itemId: 'fwaChiefSignatures',
                            bind: {
                                hidden: '{hideFwaChiefSignatures}' //'{newFwa}'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    iconCls: 'x-fa fa-remove',
                                    itemId: 'deleteChiefSignatureButton',
                                    handler: 'onDeleteChiefSignatureClick',
                                    top: '2.8em',
                                    right: '.0em'
                                },
                                {
                                    xtype: 'segmentedbutton',
                                    allowMultiple: true,
                                    items: [
                                        {
                                            cls: 'ts-bt-margin-small',
                                            text: {_tr: 'crewChiefLabel', tpl: 'Manage {0} Signature'},
                                            handler: 'onManageChiefApproval',
                                            reference: 'chiefApprovalButton',
                                            itemId: 'chiefApprovalButton',
                                            width: '75%'
                                        },
                                        {
                                            text: 'View All',
                                            width: '25%',
                                            handler: 'viewAllChiefSignatures',
                                            itemId: 'viewAllChiefSignatureButton'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'image',
                                    reference: 'chiefApprovalImage',
                                    itemId: 'chiefApprovalImage',
                                    attachmentId: null,
                                    height: 75,
                                    hidden: true
                                },
                                {
                                    xtype: 'textfield',
                                    userCls: 'ts-long-label',
                                    itemId: 'chiefApprovalDate',
                                    label: 'Signature Date',
                                    bind: '{selectedFWA.chiefApprovalDate}',
                                    dateFormat: 'n/j/Y',
                                    component: {
                                        useMask: false
                                    },
                                    readOnly: true
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    listeners: {
        painted: 'onClearDirty'
    }
})
;
