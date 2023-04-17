/**
 * Created by steve.tess on 7/23/2018.
 */
Ext.define('TS.view.exp.Main', {
    extend: 'TS.view.main.Main',

    xtype: 'app-exp',

    requires: [
        'TS.controller.exp.MainController',
        'TS.model.exp.MainModel'
    ],

    fullscreen: true,

    config: {
        fromFSS: true
    },

    controller: 'exp-main',
    viewModel: 'exp-main',

    items: [
        {
            xtype: 'container',
            layout: 'fit',
            title: 'Main card',
            scrollable: true,
            items: [
                {
                    xtype: 'titlebar',
                    cls: 'ts-navigation-header',
                    docked: 'top',
                    title: 'Expense Reports',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa  fa-home',
                            align: 'left',
                            handler: 'onBackToFSS',
                            bind: {
                                hidden: '{!fromFSS}'
                            }
                        }, {
                            align: 'right',
                            iconCls: 'x-fa fa-bars',
                            handler: 'onEditReportMenuTap'
                        }
                    ]
                }, {
                    xtype: 'exp-report-list',
                    reference: 'expReports',
                    bind: {
                        store: '{expreportlist}',
                        selection: '{selectedExpReport}'
                    },
                    style: 'border-bottom:1px solid #ccc',
                    flex: 1,
                    listeners: {
                        itemsingletap: 'editSelectedExpReport'
                    }
                }
            ]
        },
        {
            xtype: 'exp-list',
            reference: 'expList',
            title: 'Expense List'
        },
        {
            xtype: 'exp-edit',
            title: 'Expense'
        }
    ]

});