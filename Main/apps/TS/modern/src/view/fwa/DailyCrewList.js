/**
 * Created by steve.tess on 6/7/2018.
 */
Ext.define('TS.view.fwa.DailyCrewList', {
    extend: 'Ext.Sheet',

    xtype: 'dailycrewlist',

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
                    handler: function (bt) {
                        var sheet = bt.up('sheet');
                        sheet.hide();
                    }
                }
            ]
        },
        {
            xtype: 'panel',
            layout: 'vbox',
            items: [
                {
                    xtype: 'grid',
                    cls: 'taskList',
                    title: {_tr: 'crewLabelPlural'},
                    reference: 'crewGrid',
                    itemId: 'crewGrid',
                    flex: 1,
                    scrollable: true,
                    hideHeaders: true,
                    style: 'border-bottom: 1px solid blue;',
                    columns: [
                        {
                            dataIndex: 'crewId',
                            hidden: true
                        },
                        {
                            dataIndex: 'crewName',
                            flex: 1,
                            text: {_tr: 'crewLabel'},
                            align: 'center'
                        }
                    ],
                    listeners: {
                        selectionchange: 'onSelectionCrewChange'
                    }
                },
                {
                    xtype: 'grid',
                    cls: 'taskList',
                    title: {_tr: 'fwaAbbrevLabel', tpl: 'Current {0}s'},
                    reference: 'crewTaskGrid',
                    itemId: 'crewTaskGrid',
                    hideHeaders: true,
                    emptyText: {_tr: 'fwaAbbrevLabel', tpl: 'No {0}s for selected date'},
                    height: '50%',
                    scrollable: true,
                    hidden: true,
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
                    reference: 'crewTaskDateBar',
                    itemId: 'crewTaskDateBar',
                    hidden: true,
                    layout: {
                        pack: 'center'
                    },
                    docked: 'bottom',
                    items: [
                        {
                            iconCls: 'x-fa fa-arrow-left',
                            handler: 'lastCrewTaskDate',
                            reference: 'lastCrewTaskDate',
                            itemId: 'lastCrewTaskDate',
                            align: 'left'
                        },
                        {
                            xtype: 'displayfield',
                            cls: 'ts-navigation-header',
                            reference: 'crewTaskDateHeader',
                            itemId: 'crewTaskDateHeader',
                            //value: 'Date',
                            width: 100,
                            style: 'color: white'
                        },
                        {
                            iconCls: 'x-fa fa-arrow-right',
                            handler: 'nextCrewTaskDate',
                            reference: 'nextCrewTaskDate',
                            itemId: 'nextCrewTaskDate',
                            align: 'right'
                        }
                    ]
                }
            ]
        }
    ]
});