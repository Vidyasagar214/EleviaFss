/*
 * This is the main UI container which instantiates each of the child UI components
 * */
Ext.define('TS.view.crew.CrewPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'panel-crew',

    controller: 'panel-crew',
    layout: 'border',
    border: false,
    //cls: 'toolbar-background',
    items: [
        {
            xtype: 'grid-employee',
            reference: 'employeeGrid',
            split: true,
            title: 'Available Employees',
            width: 485,

            plugins: 'responsive',
            responsiveConfig: {
                'width < 800': {
                    region: 'north'
                },
                'width >= 800': {
                    region: 'west'
                }
            },

            store: {
                model: 'TS.model.shared.Employee',
                autoLoad: false,
                proxy: {
                    type: 'default',
                    directFn: 'Employee.GetList',
                    paramOrder: 'dbi|username|start|limit|includeInactive|fwaEmployeesOnly',
                    extraParams: {
                        includeInactive: false,
                        fwaEmployeesOnly: true
                    }
                },
                // filters: [{
                //     property: 'status',
                //     value: /Peter/
                // }],
                listeners: {
                    load: function (t, records, successful, message) {
                        var settings = TS.app.settings;
                        if (!successful) {
                            var error = {mdBody: 'Load of Employees failed (' + message.error.mdBody + ').'};
                            Ext.GlobalEvents.fireEvent('Error', error);
                        }
                    }
                }
            }, bind:{
                disabled: '{settings.schedReadOnly}'
            }

        },
        {
            xtype: 'grid-crew',
            reference: 'crewGrid',
            region: 'center',
            listeners: {
                select: 'crewSelect',
                deselect: 'crewDeselect'
            }
        }
    ],

    tbar: {
        //ui: 'darkblue',
        cls: 'toolbar-background',
        items: [
            {
                iconCls: 'x-fa fa-home',
                align: 'left',
                handler: 'onBackToFSS',
                bind: {
                    hidden: '{!fromFSS}'
                },
                width: 70,
                //tooltip: 'FSS application list',
                style: 'margin-right: 25px;'
            },
            '->',
            {
                xtype: 'button',
                minHeight: 20,
                align: 'right',
                text: {_tr: 'crewLabel', tpl: 'New {0}'},
                width: 120,
                handler: 'onCreateCrewClick',
                //tooltip: {_tr: 'crewLabel', tpl: 'Add new {0}'},
                bind:{
                    hidden: '{settings.schedReadOnly}'
                }
            },
            {
                xtype: 'button',
                minHeight: 20,
                align: 'right',
                text: 'Show Inactive',
                itemId: 'ShowInactiveButton',
                width: 120,
                handler: 'onShowHideCrewClick',
                //tooltip: {_tr: 'crewLabel', tpl: 'Show/Hide inactive {0}s'}
            },
            {
                xtype: 'button',
                minHeight: 20,
                align: 'right',
                text: 'Manage Crews',
                handler: 'onManageCrewClick',
                width: 120,
                //tooltip: {_tr: 'crewLabel', tpl: 'Manage Crew Owners'},
                bind:{
                    hidden: '{settings.schedReadOnly}'
                }
            },
            '->',
            {
                iconCls: 'x-fa fa-refresh',
                align: 'right',
                tooltip: 'Refresh screen',
                handler: 'refreshCrewPanel'
            },
            {
                iconCls: 'x-fa fa-cogs',
                handler: 'openSettingsWindow',
                tooltip: 'User Settings',
                width: 75
            },
            {
                iconCls: 'x-fa fa-info-circle',
                width: 25,
                handler: 'openAboutFss',
                tooltip: 'About FSS'
            }
        ]
    }
});
