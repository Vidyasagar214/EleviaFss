/**
 * Created by steve.tess on 11/5/2016.
 */
Ext.define('TS.view.crew.EmployeeViewPanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'panel-employeeview',

    controller: 'employeeviewpanel',

    // Some panel configs
    layout: 'border',
    border: false,
    items:[
        {
            xtype: 'employeeviewgrid',
            itemId: 'employeeViewGrid',
            //title: {_tr: 'crewLabel', tpl: ' Current {0} Assignments'},
            //scrollable: true,
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
                itemId: 'btnLessThan',
                text: '< 8 Hrs',
                tooltip: 'View Hours < 8',
                enableToggle: true,
                pressed: false,
                listeners:{
                    toggle: 'filterLessThan'
                }
            },
            {
                xtype: 'label',
                itemId: 'evCurrentDate',
                style: 'color: white',
                padding: '0 0 0 10',
                bind:{
                    html: '<b>{evCurrentDate}</b>'
                }
            },
            '->',
            {
                iconCls: 'x-fa fa-refresh',
                align: 'right',
                tooltip: 'Refresh screen',
                handler: 'refreshEmployeeView'
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