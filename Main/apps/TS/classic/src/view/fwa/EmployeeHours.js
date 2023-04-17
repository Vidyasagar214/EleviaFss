Ext.define('TS.view.fwa.EmployeeHours', {
    extend: 'Ext.grid.Panel',

    xtype: 'grid-employeehours',

    controller: 'grid-employeehours',
    requires: [
        'TS.Messages',
        'TS.common.field.WorkCode',
        'TS.model.fwa.Work'
    ],
    cls: 'fwaunitgrid',
    reference: 'employeeHoursGrid',
    itemId: 'empHoursGrid',

    isScheduler: false,
    scrollable: 'auto',
    store: {
        model: 'TS.model.fwa.FwaHours',
        sorters: [
            {
                property: 'workCodeId',
                direction: 'ASC'
            },
            {
                property: 'isChief',
                direction: 'DESC'
            },
            {
                property: 'crewRoleId',
                direction: 'ASC'
            }
        ]
    },

    viewConfig: {
        columnLines: false,
        markDirty: false,
        getRowClass: function (record, rowIndex, rowParams, store) {
            var settings = TS.app.settings;
            return (settings.empId != record.get('empId') && !settings.tsCanEnterCrewMemberTime ? 'readonly-row' : '');
        }
    },
    // Allow waiting until Employees & Roles stores have completed loading
    deferRowRender: true,

    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }, {
        ptype: 'employeetooltip'
    }],

    columns: [
        {
            xtype: 'datecolumn',
            text: 'Date',
            editor: 'datefield',
            dataIndex: 'workDate',
            reference: 'workDateField',
            hidden: true,
            menuDisabled: true,
            flex: 1,
            maxWidth: 120,
            //renderer: renderDate
        }, {
            text: 'Employee',
            dataIndex: 'empId',
            style: 'border-left: 1px solid #b0b0b0 !important;',
            flex: .75,
            menuDisabled: true,
            //only active employees when edit or new
            editor: {
                xtype: 'field-employee',
                listeners: {
                    change: 'empHoursChanged'
                }
            },
            renderer: function (value, meta, rec) {
                meta.style = 'border-left: 1px solid #b0b0b0 !important;';
                //all employees when displaying
                var record = Ext.getStore('AllEmployees').getById(value),
                    tip = 'employeetooltip';
                return (record ? record.get('lname') + ', ' + record.get('fname') : 'N/A');
            }
        }, {
            text: 'Role',
            dataIndex: 'crewRoleId',
            flex: .75,
            editor: {
                xtype: 'field-crewrole',
                listeners: {
                    change: 'empHoursChanged'
                }
            },
            menuDisabled: true,
            renderer: function (value) {
                var record = Ext.getStore('Roles').getById(value);
                return (record ? record.get('crewRoleName') : 'N/A');
            }
        }, {
            text: 'Work Code',
            dataIndex: 'workCodeAbbrev',
            flex: .75,
            editor: {
                xtype: 'field-workcode',
                listeners: {
                    change: 'empHoursChanged'
                }
            },
            menuDisabled: true,
            bind: {
                hidden: '{hideEmployeeHrsWorkCode}'
            }
        }, {
            text: {_tr: 'laborCodeLabel', tpl: '{0}'},
            dataIndex: 'laborCode',
            readOnly: true,
            flex: .5
        }, {
            xtype: 'actioncolumn',
            width: 25,
            resizable: false,
            menuDisabled: true,
            items: [{
                iconCls: 'x-fa fa-search blackIcon',
                tooltip: 'Lookup',
                handler: 'showLaborCodeLookupWindow'
            }]
        },

        // {
        //     text: 'Time In',
        //     dataIndex: 'startTime',
        //     reference: 'workCodeStartTime',
        //     flex: .5,
        //     xtype: 'datecolumn',
        //     format: 'g:i A',
        //     editor: {
        //         xtype: 'timefield',
        //         editable: false,
        //         bind: {
        //             minValue: '{settings.schedVisibleHoursStart}',
        //             maxValue: '{settings.schedVisibleHoursEnd}',
        //         },
        //         increment: 30,
        //         anchor: '100%',
        //         listeners: {
        //             change: 'onStartTimeChange'
        //         }
        //     },
        //     hidden:true
        // },

        // {
        //     text: 'Time Out',
        //     dataIndex: 'endTime',
        //     reference: 'workCodeEndTime',
        //     flex: .5,
        //     xtype: 'datecolumn',
        //     format: 'g:i A',
        //     editor: {
        //         xtype: 'timefield',
        //         reference:'myEndTime',
        //         editable: false,
        //         bind: {
        //             minValue: '{settings.schedVisibleHoursStart}',
        //             maxValue: '{settings.schedVisibleHoursEnd}',
        //         },
        //         increment: 30,
        //         anchor: '100%',
        //         listeners: {
        //             change: 'onEndTimeChange'
        //         }
        //     },
        //     hidden:true
        // },

        {
            header: 'Reg Hrs',
            editor: {
                xtype: 'numberfield',
                maxValue: 24,
                minValue: 0,
                listeners: {
                    spin: function (obj, direction) {
                        var s = TS.app.settings;
                        switch (s.tsIncrement) {
                            case 15:
                                obj.step = .25;
                                break;
                            case 30:
                                obj.step = .5;
                                break;
                            default:
                                obj.step = 1;
                                break;
                        }
                    },
                    dirtychange: function () {
                        Ext.first('grid-employeehours').getStore().dirty = true;
                    },
                    change: 'empHoursChanged'
                }
            },
            dataIndex: 'regHrs',
            //width: 90,
            flex: .4,
            menuDisabled: true,
            renderer: function (value, meta) {
                if (parseInt(value) >= 0) {
                    meta.style = "background-color:white;";
                } else {
                    meta.style = "background-color:#ffffad;";
                }
                return value;
            }
        }, {
            header: 'Ovt Hrs',
            editor: {
                xtype: 'numberfield',
                minValue: 0,
                maxValue: 24,
                listeners: {
                    spin: function (obj, direction) {
                        var s = TS.app.settings;
                        switch (s.tsIncrement) {
                            case 15:
                                obj.step = .25;
                                break;
                            case 30:
                                obj.step = .5;
                                break;
                            default:
                                obj.step = 1;
                                break;
                        }
                    },
                    change: 'empHoursChanged'
                }
            },
            dataIndex: 'ovtHrs',
            //width: 90,
            flex: .4,
            menuDisabled: true,
            renderer: function (value, meta) {
                if (parseInt(value) >= 0) {
                    meta.style = "background-color:white;";
                } else {
                    meta.style = "background-color:#ffffad;";
                }
                return value;
            },
            bind: {
                hidden: '{!settings.tsAllowOvtHrs}'
            }
        }, {
            header: 'Ovt2 Hrs',
            editor: {
                xtype: 'numberfield',
                minValue: 0,
                maxValue: 24,
                listeners: {
                    spin: function (obj, direction) {
                        var s = TS.app.settings;
                        switch (s.tsIncrement) {
                            case 15:
                                obj.step = .25;
                                break;
                            case 30:
                                obj.step = .5;
                                break;
                            default:
                                obj.step = 1;
                                break;
                        }
                    },
                    change: 'empHoursChanged'
                }
            },
            dataIndex: 'ovt2Hrs',
            //width: 90,
            flex: .4,
            menuDisabled: true,
            renderer: function (value, meta) {
                if (parseInt(value) >= 0) {
                    meta.style = "background-color:white;";
                } else {
                    meta.style = "background-color:#ffffad;";
                }
                return value;
            },
            bind: {
                hidden: '{!settings.tsAllowOvt2Hrs}'
            }
        }, {
            header: 'Travel Hrs',
            editor: {
                xtype: 'numberfield',
                minValue: 0,
                maxValue: 24,
                listeners: {
                    spin: function (obj, direction) {
                        var s = TS.app.settings;
                        switch (s.tsIncrement) {
                            case 15:
                                obj.step = .25;
                                break;
                            case 30:
                                obj.step = .5;
                                break;
                            default:
                                obj.step = 1;
                                break;
                        }
                    },
                    change: 'empHoursChanged'
                }
            },
            dataIndex: 'travelHrs',
            //width: 90,
            flex: .4,
            menuDisabled: true,
            renderer: function (value, meta) {
                if (parseInt(value) >= 0) {
                    meta.style = "background-color:white;";
                } else {
                    meta.style = "background-color:#ffffad;";
                }
                return value;
            },
            bind: {
                hidden: '{!settings.tsAllowTravelHrs}'
            },
            listeners: {
                change: 'empHoursChanged'
            }
        },
        {
            text: 'Attributes',
            dataIndex: 'attributes',
            flex: 1,
            editor: 'textfield',
            menuDisabled: true,
            hidden: true
        }, {
            text: 'Comments',
            dataIndex: 'comment',
            flex: 1,
            editor: {
                type: 'textfield',
                enforceMaxLength: true,
                maxLength: 255,
                listeners: {
                    change: 'empHoursChanged'
                }
            },
            maxLength: 255,
            menuDisabled: true,
            plugins: {
                ptype: 'responsive'
            },
            responsiveConfig: {
                small: {
                    hidden: true
                },
                normal: {
                    hidden: false
                }
            }
        }, {
            xtype: 'actioncolumn',
            style: 'border-right: 1px solid #b0b0b0 !important;',
            width: 25,
            resizable: false,
            menuDisabled: true,
            items: [{
                iconCls: 'x-fa fa-trash redIcon',
                tooltip: 'Delete',
                handler: 'deleteEmployeeHours'
            }],
            renderer: function (value, meta, rec) {
                meta.style = 'border-right: 1px solid #b0b0b0 !important;';
                return;
            }
        }, {
            xtype: 'actioncolumn',
            width: 25,
            resizable: false,
            menuDisabled: true,
            hidden: true
        },
        {
            dataIndex: 'workCodeId',
            hidden: true,
            hideable: false
        }
    ],

    dockedItems: [{
        xtype: 'toolbar',
        style: 'background: #e6e6e6 !important;',
        dock: 'bottom',
        items: [
            {
                xtype: 'button',
                reference: 'newEmployeeHours',
                handler: 'onNewEmployeeHours',
                iconCls: 'x-fa fa-plus greenIcon',
                tooltip: 'Add Employee'
            }
        ]
    }],

    listeners: {
        edit: 'onHoursCommentEdit',
        beforeedit: 'checkReadOnly',
        beforecellclick: 'stopReadOnly',
        beforecelldblclick: 'stopReadOnly',
    }

});
