/**
 * Created by steve.tess on 6/7/2018.
 */
Ext.define('TS.view.crew.CrewTaskPanel', {
    extend: 'Ext.panel.Panel',

    xtype: 'crewtaskpanel',

    requires: [
        'TS.controller.crew.CrewTaskPanelController'
    ],

    controller: 'crewtaskpanel',
    border: false,
    scrollable: 'y',
    items: [
        {
            xtype: 'crewtaskgrid',
            itemId: 'crewTaskGrid',
            region: 'center'
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
            {
                xtype: 'radiogroup',
                itemId: 'groupByButtons',
                fieldLabel: 'Group By',
                labelStyle: 'color: white',
                labelAlign: 'right',
                defaultType: 'radiofield',
                items: [
                    {
                        checked: true,
                        name: 'groupByType',
                        style: 'color: white; padding-right: 10px;',
                        inputValue: 'scheduledCrewName',
                        bind: {
                            boxLabel: '{settings.crewLabel}'
                        }
                    },
                    {
                        style: 'color: white; padding-right: 10px;',
                        name: 'groupByType',
                        inputValue: 'clientName',
                        bind: {
                            boxLabel: '{settings.clientLabel}'
                        }
                    },
                    {
                        style: 'color: white',
                        name: 'groupByType',
                        inputValue: 'wbs1Name',
                        bind: {
                            boxLabel: '{settings.wbs1Label}'
                        }
                    }
                ],
                listeners: {
                    change: 'onGroupChange'
                }
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
                iconCls: 'x-fa fa-arrow-left',
                handler: 'filterByLastDay',
                tooltip: 'View Previous'
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
                iconCls: 'x-fa fa-arrow-right',
                handler: 'filterByNextDay',
                tooltip: 'View Next'
            },
            {
                text: 'Week View',
                //iconCls: 'x-fa fa-calendar',
                handler: 'filterByWeek',
                width: 100,
                tooltip: 'Week View'
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
                xtype: 'label',
                itemId: 'crewCurrentDate',
                style: 'color: white; font-size: 17px;',
                padding: '0 0 0 10',
                bind: {
                    html: '<b>{crewCurrentDate}</b>'
                }
            },
            '->',
            {
                iconCls: 'x-fa fa-file',
                tooltip: 'Save to Xcel',
                handler: 'onSaveToXcel'
            },
           {
                iconCls: 'x-fa fa-list',
                align: 'right',
                tooltip: 'Clear Filters - See All',
                handler: 'refreshCrewTask'
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