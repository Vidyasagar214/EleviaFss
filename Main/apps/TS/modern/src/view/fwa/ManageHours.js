Ext.define('TS.view.fwa.ManageHours', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-managehours',

    requires: [
        'Ext.grid.plugin.Editable'
    ],

    controller: 'fwa-edit',
    itemId: 'manageHours',

    stretchX: true,
    stretchY: true,
    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: 'Employee Hours',
            items: [
                {
                    iconCls: 'x-fa fa-plus',
                    handler: 'addHours',
                    reference: 'addHoursButton',
                    itemId: 'addButton'
                },
                {
                    align: 'right',
                    text: 'Close',
                    handler: 'closeHoursSheet'
                }
            ]
        },
        {
            xtype: 'toolbar',
            cls: 'ts-navigation-header',
            reference: 'workCodeDateBar',
            //hidden: true,
            layout: {
                pack: 'center'
            },
            docked: 'top',
            items: [
                {
                    iconCls: 'x-fa fa-arrow-left',
                    handler: 'lastDate',
                    reference: 'lastDate',
                    itemId: 'lastHoursDate',
                    align: 'left'
                },
                {
                    xtype: 'displayfield',
                    cls: 'ts-navigation-header',
                    reference: 'dateHeader',
                    itemId: 'dateHeader',
                    value: 'Date',
                    width: 100,
                    style: 'color: white; white-space: nowrap;'
                },
                {
                    iconCls: 'x-fa fa-arrow-right',
                    handler: 'nextDate',
                    reference: 'nextDate',
                    itemId: 'nextHoursDate',
                    align: 'right'
                },
                {
                    //text: 'Add Date',
                    iconCls: 'x-fa fa-calendar-plus-o',
                    handler: 'onAddWorkDate',
                    reference: 'addWorkDate',
                    itemId: 'nextHoursDate',
                    align: 'right',
                    hidden: true
                }
            ]
        },
        {
            xtype: 'grid',
            reference: 'hoursGrid',
            itemId: 'hoursGrid',
            //cls: 'x-list-header',
            itemTpl: '{workDate}',
            grouped: true,
            bind: {
                store: '{selectedFWA.hours}',
                selection: '{selectedHRS}'
            },

            emptyText: 'Tap plus icon to add hours',
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
                                xtype: 'datepickerfield',
                                dateformat: DATE_FORMAT,
                                name: 'workDate', //this should match dataIndex you would like to edit
                                itemId: 'hoursWorkDate',
                                disabledCls: '',
                                label: 'Date',
                                listeners: {
                                    change: function (me, newValue, oldValue) {
                                        if (me.getParent().getRecord()) {
                                            me.getParent().getRecord().set('modified', 'M');
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'selectfield',
                                itemId: 'empGroupSelect',
                                disabledCls: '',
                                autoSelect: false,
                                valueField: 'empGroupId',
                                displayField: 'empGroupName',
                                store: 'EmpGroups',
                                name: 'empGroupId',
                                label: 'Group',
                                listeners: {
                                    change: function (me, newValue, oldValue) {
                                        var store = Ext.getStore('Employees');
                                        store.clearFilter();
                                        if (newValue) {
                                            if (newValue.get('empGroupId') > 0)
                                                store.filterBy(function (obj) {
                                                    if (!newValue || newValue.get('empGroupId') == 0) return true;
                                                    return obj.get('empGroupId') == newValue.get('empGroupId');
                                                });
                                        }
                                        if (me.getParent().getRecord()) {
                                            me.getParent().getRecord().set('modified', 'M');
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'selectfield',
                                autoSelect: false,
                                disabledCls: '',
                                itemId: 'hoursEmpName',
                                reference: 'hoursEmpName',
                                valueField: 'empId',
                                displayField: 'empName',
                                store: 'Employees',
                                name: 'empId',
                                label: 'Employee',
                                listeners: {
                                    change: function (me, newValue, oldValue) {
                                        if (newValue) {
                                            var crewRoleId = newValue.get('defaultCrewRoleId'),
                                                //laborCodeId = newValue.get('tsDefLaborCode'),
                                                store = Ext.first('#hoursGrid').getStore(),
                                                isChief = false,
                                                settings = TS.app.settings;
                                            me.getParent().getItems().getRange()[3].setValue(crewRoleId);
                                            //me.getParent().getItems().getRange()[5].getItems().items[1].setValue(laborCodeId);
                                            if (TS.app.settings.defaultWorkCode) {
                                                me.getParent().getItems().getRange()[4].setValue(TS.app.settings.defaultWorkCode);
                                                TS.app.settings.defaultWorkCode = '';
                                            }
                                            Ext.each(store.getRange(), function (rec) {
                                                if (rec.get('isChief') && rec.get('empId') == settings.empId) {
                                                    isChief = true;
                                                }
                                            })
                                            if ((!isChief && settings.empId != newValue.get('empId') && !settings.tsCanEnterCrewMemberTime) ||
                                                isChief && !settings.tsCanEnterCrewMemberTime && settings.empId != newValue.get('empId')) {
                                                Ext.Msg.alert('Warning', 'User does not have rights to edit a ' + settings.crewLabel + ' member.');
                                                Ext.first('#employeeHours').setDisabled(true);
                                                Ext.first('#employeeHours').setTitle('Hours - Read Only');
                                                Ext.first('fwa-managehours').setDisabled(true);
                                                Ext.first('#hoursGrid').getPlugins()[0].setEnableDeleteButton(false);
                                                Ext.first('#hoursGrid').getPlugins()[0].setDisableSubmitBt(true);
                                            } else {
                                                Ext.first('#employeeHours').setDisabled(false);
                                                Ext.first('fwa-managehours').setDisabled(false);
                                                Ext.first('#hoursGrid').getPlugins()[0].setEnableDeleteButton(true);
                                                Ext.first('#hoursGrid').getPlugins()[0].setDisableSubmitBt(false);
                                            }
                                        }
                                        if (me.getParent().getRecord()) {
                                            me.getParent().getRecord().set('modified', 'M');
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'selectfield',
                                autoSelect: false,
                                disabledCls: '',
                                itemId: 'hoursCrewRole',
                                valueField: 'crewRoleId',
                                displayField: 'crewRoleName',
                                name: 'crewRoleId',
                                label: 'Role',
                                store: 'ActiveRoles',
                                reference: 'employeeCrewRole',
                                listeners: {
                                    change: function (me, newValue, oldValue) {
                                        if (me.getParent().getRecord()) {
                                            me.getParent().getRecord().set('modified', 'M');
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'field-workcode',
                                autoSelect: false,
                                disabledCls: '',
                                name: 'workCodeId',
                                itemId: 'workCodeGridEditColumn',
                                label: {_tr: 'workCodeLabel'},
                                listeners: {
                                    change: function (me, newValue, oldValue) {
                                        if (me.getParent().getRecord()) {
                                            me.getParent().getRecord().set('modified', 'M');
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'container',
                                items: [
                                    {
                                        xtype: 'button',
                                        top: '.0em',
                                        right: '.0em',
                                        iconCls: 'x-fa  fa-search',
                                        disabledCls: '',
                                        handler: 'onLaborCodeLookup',
                                        itemId: 'laborCodeBtn'
                                    },
                                    {
                                        xtype: 'textfield',
                                        readOnly: true,
                                        itemId: 'laborCodeField',
                                        name: 'laborCode',
                                        reference: 'laborCodeField',
                                        label: {_tr: 'laborCodeLabel'}
                                    }
                                ]
                            },

                            // {
                            //     xtype: 'timepickerfield',
                            //     hidden: true,
                            //     label: 'Time In',
                            //     disabledCls: '',
                            //     reference: 'workCodeStartTimeField',
                            //     itemId: 'workCodeStartTimeField',
                            //     name: 'startTime',
                            //     dateFormat: HOUR_DAY_MIDDLE,
                            //     listeners: {
                            //         change: function (me, newValue, oldValue) {
                            //             if (me.getParent().getRecord()) {
                            //                 me.getParent().getRecord().set('modified', 'M');
                            //             }
                            //         }
                            //     }
                            // },

                            // {
                            //     xtype: 'timepickerfield',
                            //     hidden: true,
                            //     label: 'Time Out',
                            //     disabledCls: '',
                            //     reference: 'workCodeEndTimeField',
                            //     itemId: 'workCodeEndTimeField',
                            //     name: 'endTime',
                            //     dateFormat: HOUR_DAY_MIDDLE,
                            //     listeners: {
                            //         change: function (me, newValue, oldValue) {
                            //             if (me.getParent().getRecord()) {
                            //                 me.getParent().getRecord().set('modified', 'M');
                            //             }
                            //         }
                            //     }
                            // },

                            {
                                xtype: 'fieldset',
                                reference: 'employeeHours',
                                itemId: 'employeeHours',
                                title: 'Hours',
                                layout: 'hbox',
                                userCls: 'ts-wide-fieldset',
                                defaults: {
                                    flex: 1,
                                    labelAlign: 'top'
                                },
                                //disabled: true,
                                items: [
                                    {
                                        xtype: 'numberfield',
                                        itemId: 'hoursRegHrs',
                                        disabledCls: '',
                                        name: 'regHrs',
                                        label: 'Regular',
                                        stepValue: 1,
                                        style: 'border: 1px solid #ccc;',
                                        listeners: {
                                            focus: function (obj, e) {
                                                var scroller = obj.getParent().getParent().getScrollable();
                                                TS.app.settings.currentPosition = scroller.position.y;
                                                if (Ext.os.is.Android && Ext.os.is.Phone)
                                                    scroller.scrollTo(null, 250);
                                            },
                                            blur: function (obj, e) {
                                                var scroller = obj.getParent().getParent().getScrollable();
                                                if (Ext.os.is.Android && Ext.os.is.Phone)
                                                    scroller.scrollTo(null, TS.app.settings.currentPosition);
                                            },
                                            change: function (me, newValue, oldValue, eOpts) {
                                                var mod = me.getParent().getItems().getRange()[4];
                                                if (me.getParent().getParent().getRecord())
                                                    mod.setValue('M');
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'numberfield',
                                        itemId: 'hoursOvtHrs',
                                        disabledCls: '',
                                        name: 'ovtHrs',
                                        label: 'Ovt',
                                        stepValue: 1,
                                        style: 'border: 1px solid #ccc;',
                                        reference: 'ovtHrsField',
                                        listeners: {
                                            focus: function (obj, e) {
                                                var scroller = obj.getParent().getParent().getScrollable();
                                                TS.app.settings.currentPosition = scroller.position.y;
                                                if (Ext.os.is.Android && Ext.os.is.Phone)
                                                    scroller.scrollTo(null, 250);
                                            },
                                            blur: function (obj, e) {
                                                var scroller = obj.getParent().getParent().getScrollable();
                                                if (Ext.os.is.Android && Ext.os.is.Phone)
                                                    scroller.scrollTo(null, TS.app.settings.currentPosition);
                                            },
                                            change: function (me, newValue, oldValue, eOpts) {
                                                var mod = me.getParent().getItems().getRange()[4];
                                                if (me.getParent().getParent().getRecord())
                                                    mod.setValue('M');
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'numberfield',
                                        itemId: 'hoursOvt2Hrs',
                                        disabledCls: '',
                                        name: 'ovt2Hrs',
                                        label: 'Ovt 2',
                                        stepValue: 1,
                                        style: 'border: 1px solid #ccc;',
                                        reference: 'ovt2HrsField',
                                        listeners: {
                                            focus: function (obj, e) {
                                                var scroller = obj.getParent().getParent().getScrollable();
                                                TS.app.settings.currentPosition = scroller.position.y;
                                                if (Ext.os.is.Android && Ext.os.is.Phone)
                                                    scroller.scrollTo(null, 250);
                                            },
                                            blur: function (obj, e) {
                                                var scroller = obj.getParent().getParent().getScrollable();
                                                if (Ext.os.is.Android && Ext.os.is.Phone)
                                                    scroller.scrollTo(null, TS.app.settings.currentPosition);
                                            },
                                            change: function (me, newValue, oldValue, eOpts) {
                                                var mod = me.getParent().getItems().getRange()[4];
                                                if (me.getParent().getParent().getRecord())
                                                    mod.setValue('M');
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'numberfield',
                                        itemId: 'hoursTravelHrs',
                                        disabledCls: '',
                                        name: 'travelHrs',
                                        label: 'Travel',
                                        stepValue: 1,
                                        style: 'border: 1px solid #ccc;',
                                        reference: 'travelHrsField',
                                        listeners: {
                                            focus: function (obj, e) {
                                                var scroller = obj.getParent().getParent().getScrollable();
                                                TS.app.settings.currentPosition = scroller.position.y;
                                                if (Ext.os.is.Android && Ext.os.is.Phone)
                                                    scroller.scrollTo(null, 250);
                                            },
                                            blur: function (obj, e) {
                                                var scroller = obj.getParent().getParent().getScrollable();
                                                if (Ext.os.is.Android && Ext.os.is.Phone)
                                                    scroller.scrollTo(null, TS.app.settings.currentPosition);
                                            },
                                            change: function (me, newValue, oldValue, eOpts) {
                                                var mod = me.getParent().getItems().getRange()[4];
                                                if (me.getParent().getParent().getRecord())
                                                    mod.setValue('M');
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'textfield',
                                        name: 'modified',
                                        reference: 'modifiedField',
                                        hidden: true
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldset',
                                title: 'Comments',
                                layout: 'hbox',
                                height: 'auto',
                                userCls: 'ts-wide-fieldset',
                                defaults: {
                                    flex: 1,
                                    labelAlign: 'top'
                                },
                                items: [
                                    {
                                        xtype: 'textareafield',
                                        itemId: 'hoursComments',
                                        name: 'comment',
                                        maxRows: 25,
                                        listeners: {
                                            change: function (me, newValue, oldValue) {
                                                var commentLength = Ext.first('#hoursGrid').getSelection() ? Ext.first('#hoursGrid').getSelection().get('comment').length : 25;
                                                me.setMaxRows((commentLength / 25) + 1);
                                                //console.log();
                                                if (me.getParent().getRecord()) {
                                                    me.getParent().getRecord().set('modified', 'M');
                                                }
                                            }
                                        }
                                    }
                                ]
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
                        items: [
                            {
                                xtype: 'button',
                                ui: 'decline',
                                text: 'Cancel',
                                align: 'right',
                                action: 'cancel'
                            }, {
                                xtype: 'button',
                                ui: 'confirm',
                                text: 'Save',
                                align: 'left',
                                action: 'submit'
                            }
                        ]
                    }
                }
            ],
            columns: [
                {
                    xtype: 'datecolumn',
                    reference: 'workDateField',
                    hidden: true,
                    text: 'Start',
                    dataIndex: 'workDate',
                    format: 'n/j/Y',
                    editable: true,
                    width: 100,
                    renderer: function (value) {
                        return value || '-';
                    }
                },
                {
                    text: 'Employee',
                    dataIndex: 'empId',
                    height: 50,
                    flex: 1,
                    renderer: function (value) {
                        var record = Ext.getStore('AllEmployees').getById(value);
                        return (record ? record.get('empName') : 'N/A');
                    }
                },
                {
                    text: {_tr: 'workCodeLabel'},
                    dataIndex: 'workCodeId',
                    flex: 2,
                    renderer: function (value) {
                        var record = Ext.getStore('WorkCodes').getById(value);
                        return (record ? record.get('workCodeAbbrev') + '-' + record.get('workCodeDescr') : 'N/A');
                    }
                },
                {
                    hidden: true,
                    text: 'Group',
                    flex: .5,
                    dataIndex: 'empGroupId'
                },
                {
                    dataIndex: 'modified',
                    hidden: true
                },
                {
                    dataIndex: 'startTime',
                    hidden: true
                },
                {
                    dataIndex: 'endTime',
                    hidden: true
                }
            ]
        }
    ]
});

