/**
 * Created by steve.tess on 3/27/2017.
 */
Ext.define('TS.view.fwa.AddEmployeeHours', {
    extend: 'Ext.window.Window',
    xtype: 'window-addemployeehours',

    modal: true,
    layout: 'fit',

    constrainHeader: true,
    controller: 'grid-employeehours',
    reference: 'addEmployeeHours',
    itemId: 'addEmployeeHours',

    plugins: 'responsive',
    scrollable: true,

    title: 'Add Employeee Hours',
    titleAlign: 'center',

    items: [
        {
            xtype: 'form',
            reference: 'addEmployeeHoursForm',
            items: [
                {
                    xtype: 'fieldset',
                    title: 'Add Employee',
                    margin: '10 10 10 10',
                    items: [
                        //date
                        {
                            xtype: 'datefield',
                            fieldLabel: 'Work Date',
                            itemId: 'employeeDate',
                            pickerAlign: 'tl-bl?',
                            name: 'workDate',
                            publishes: [
                                'value',
                                'dirty'
                            ]
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        //employee group
                        {
                            xtype: 'field-employeegroup',
                            itemId: 'empGroupSelection',
                            name: 'empGroupId',
                            fieldLabel: 'Group',
                            listeners: {
                                change: function (me, newValue, oldValue) {
                                    var store = Ext.getStore('Employees');
                                    store.clearFilter();
                                    if (newValue > 0)
                                        store.filterBy(function (obj) {
                                            if (!newValue) return true;
                                            return obj.get('empGroupId') == newValue;
                                        });
                                    else
                                        return true;
                                }
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        //employee
                        {
                            xtype: 'field-employee',
                            name: 'employeeId',
                            fieldLabel: 'Employee',
                            listeners: {
                                change: 'setEmployeeHoursRole'
                            }
                        },
                        //role
                        {
                            xtype: 'field-crewrole',
                            reference: 'employeeHoursRole',
                            userCls: 'ts-shadow-line',
                            fieldLabel: {_tr: 'crewLabel', tpl: '{0} Role'},
                            name: 'crewRoleId'
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        //workcode
                        {
                            xtype: 'field-workcode',
                            name: 'workCodeAbbrev',
                            reference: 'workCodeCombo',
                            fieldLabel: {_tr: 'workCodeLabel'}
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'laborCode',
                                    fieldLabel: {_tr: 'laborCodeLabel'},
                                    reference: 'laborCodeField',
                                    itemId: 'laborCodeField',
                                    readOnly: true
                                },
                                {
                                    xtype: 'fixedspacer'
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'x-fa fa-search',
                                    handler: 'showLaborCodeLookupWindowFromNew'
                                }
                            ]
                        },
                        {
                            xtype: 'fixedspacer'
                        }
                    ]
                }
            ]
        }

    ],

    buttons: [
        '->',
        {
            text: 'Save',
            //iconCls: 'save',
            reference: 'saveNewEmployeeBtn',
            handler: 'saveNewEmployee',
            listeners: {
                mouseover: function (btn) {
                    btn.focus();
                }
            },
            disabled: true
        },
        {
            text: 'Cancel',
            //iconCls: 'reject-ts',
            handler: 'cancelNewEmployee'

        }
    ],
    listeners: {
        close: 'closeNewEmployee'
    }
});