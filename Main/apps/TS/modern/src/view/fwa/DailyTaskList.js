/**
 * Created by steve.tess on 1/29/2018.
 */
Ext.define('TS.view.fwa.DailyTaskList', {
    extend: 'Ext.Panel',

    xtype: 'dailytasklist',

    requires: [
        //'Ext.grid.Grid',
        'TS.common.field.Display'
    ],

    controller: 'fwa-edit',
    viewModel: 'fwa-main',

    stretchX: true,
    stretchY: true,
    layout: 'fit',
    autoDestroy: true, //custom property implemented in the override
    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: {_tr: 'fwaAbbrevLabel', tpl: 'Daily {0} List'},
            items: [
                {
                    align: 'right',
                    text: 'Close',
                    //TODO move to controller
                    handler: //'closeCrewChiefs'

                        function (bt) {
                        var sheet = bt.up('panel');
                        sheet.destroy();
                    }
                }
            ]
        },
        {
            xtype: 'panel',
            layout: 'vbox',
            //flex: 1,
            items: [
                {
                    xtype: 'grid',
                    cls: 'taskList',
                    title: {_tr: 'crewChiefLabelPlural'},
                    reference: 'crewChiefGrid',
                    itemId: 'crewChiefGrid',
                    //height: '100%',
                    flex: 1,
                    scrollable: true,
                    hideHeaders: true,
                    style: 'border-bottom: 1px solid blue;',
                    columns: [
                        {
                            dataIndex: 'crewChiefEmpId',
                            hidden: true
                        },
                        {
                            dataIndex: 'crewChiefEmpName',
                            flex: 1,
                            text: {_tr: 'crewChiefLabel'},
                            align: 'center'
                        }
                    ],
                    listeners: {
                        select: 'onSelectionCrewChiefChange'
                    }
                },
                {
                    xtype: 'grid',
                    cls: 'taskList',
                    title: {_tr: 'fwaAbbrevLabel', tpl: 'Current {0}s'},
                    reference: 'taskGrid',
                    itemId: 'taskGrid',
                    emptyText: {_tr: 'fwaAbbrevLabel', tpl: 'No {0}s for selected date'},
                    height: '50%',
                    scrollable: true,
                    hidden: true,
                    hideHeaders: true,
                    columns: [
                       {
                            dataIndex: 'topLevelDescription',
                            flex: 1
                        }
                    ],
                    listeners: {
                        itemtap: 'onSelectionFWAChange'
                    }
                },
                {
                    xtype: 'toolbar',
                    cls: 'ts-navigation-header',
                    reference: 'taskDateBar',
                    itemId: 'taskDateBar',
                    hidden: true,
                    layout: {
                        pack: 'center'
                    },
                    docked: 'bottom',
                    items: [
                        {
                            iconCls: 'x-fa fa-arrow-left',
                            handler: 'lastTaskDate',
                            reference: 'lastTaskDate',
                            itemId: 'lastTaskDate',
                            align: 'left'
                        },
                        {
                            xtype: 'displayfield',
                            cls: 'ts-navigation-header',
                            reference: 'taskDateHeader',
                            itemId: 'taskDateHeader',
                            //value: 'Date',
                            width: 110,
                            style: 'color: white'
                        },
                        {
                            iconCls: 'x-fa fa-arrow-right',
                            handler: 'nextTaskDate',
                            reference: 'nextTaskDate',
                            itemId: 'nextTaskDate',
                            align: 'right'
                        }
                    ]
                }
            ]
        }
    ]
});