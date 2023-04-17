/**
 * Created by steve.tess on 6/10/2016.
 */
Ext.define('TS.view.crew.CrewAssignPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'panel-crewassign',

    controller: 'crewassignpanel',

    // Some panel configs
    layout: 'border',
    border: false,

    items: [
        {
            xtype: 'crewassigngrid',
            itemId: 'crewAssignGrid',
            reference: 'crewAssignGrid',
            title: {_tr: 'crewLabel', tpl: ' Current {0} Assignments'},
            scrollable: true,
            region: 'center',
            listeners: {
                select: 'fwaCrewSelect',
                //deselect: 'fwaCrewDeselect',
                edit: 'onChangeCrewMember'
            }
        },
        {
            xtype: 'grid-employeeassign',
            reference: 'employeeAssignGrid',
            itemId: 'employeeAssignGrid',
            split: true,
            title: 'Available Employees',
            width: 450,
            scrollable: true,
            listeners: {
                resize: Ext.Function.bind(function (comp, width, height,
                                                    oldWidth, oldHeight, eOpts) {
                }, this)
            },
            plugins: 'responsive',
            region: 'east'
            // responsiveConfig: {
            //     'width < 600': {
            //         region: 'north'
            //     },
            //     'width >= 600': {
            //         region: 'east'
            //     }
            // }
        }
    ],

    tbar: {
        cls: 'toolbar-background',
        layout: {
            //pack: 'center'
        },
        items: [
            {
                iconCls: 'x-fa fa-home',
                width: 70,
                align: 'left',
                liquidLayout: true,
                handler: 'onBackToFSS',
                bind: {
                    hidden: '{!fromFSS}'
                },
                tooltip: 'FSS application list',
                style: 'margin-right: 25px;'
            },
            '->',
            {
                text: 'Go to Date',
                handler: 'onGoToDate',
                width: 100
            },
            {
                xtype: 'button',
                itemId: 'btnLastDay',
                //text: '<<',
                iconCls: 'x-fa fa-arrow-left',
                handler: 'filterByLastDay',
                tooltip: 'View previous day'
            },
            {
                xtype: 'button',
                itemId: 'btnToday',
                text: 'Today',
                handler: 'filterByToday',
                tooltip: 'View today'
            },
            {
                xtype: 'button',
                itemId: 'btnNextDay',
                //text: '>>',
                iconCls: 'x-fa fa-arrow-right',
                handler: 'filterByNextDay',
                tooltip: 'View next day'
            },
            {
                xtype: 'button',
                itemId: 'btnClear',
                //text: 'Reset',
                iconCls: 'x-fa fa-undo',
                handler: 'filterReset',
                tooltip: 'Reset view'
            },
            {
                xtype: 'button',
                itemId: 'btnSaveCrew',
                text: {_tr: 'crewLabel', tpl: 'Save {0}s'},
                width: 100,
                handler: 'onSaveClick',
                listeners: {
                    mouseover: function (btn) {
                        btn.focus();
                    }
                },
                bind:{
                    hidden: '{settings.schedReadOnly}'
                }
            },
            {
                xtype: 'label',
                itemId: 'currentDate',
                style: 'color: white; font-size: 17px; font-weight: bold;',
                padding: '0 0 0 10',
                bind:{
                    html: '<b>{currentDate}</b>'
                }
            },
            // '->',
            // {
            //     text: 'Export to Excel',
            //     handler: 'exportToExcel',
            //     hidden: true
            // },
            '->',
            {
                iconCls: 'x-fa fa-list',
                align: 'right',
                tooltip: 'Clear Filters - See All',
                handler: 'refreshCrewAssign'
            },
            // '->',
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