/**
 * Created by steve.tess on 8/15/2018.
 */
Ext.define('TS.view.exa.Main', {
    extend: 'TS.view.main.Main',

    xtype: 'app-exa',

    requires: [
        'TS.controller.exa.MainController',
        'TS.model.exa.MainModel'
    ],

    fullscreen: true,

    config: {
        fromFSS: true
    },

    controller: 'exa-main',
    viewModel: 'exa-main',

    header: {
        hidden: true
    },

    items:[
        {
            xtype: 'container',
            layout: 'fit',
            title: 'Main card', //will be invisible as we are hiding the tab bar
            items:[
                {
                    xtype: 'titlebar',
                    cls: 'ts-navigation-header',
                    docked: 'top',
                    title: 'Select Expense Period',
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'x-fa  fa-home',
                            align: 'left',
                            handler: 'onBackToFSS',
                            bind:{
                                hidden: '{!fromFSS}'
                            }
                        }
                    ]
                },
                {
                    xtype: 'exp-approval-date-list',
                    reference: 'approvalDates',
                    bind: {
                        store: '{expapprovaldatelist}',
                        selection: '{selectedExpDate}'
                    },
                    style: 'border-bottom:1px solid #ccc',
                    flex: 1,
                    listeners: {
                        itemsingletap: 'editSelectedExpDate',
                        painted: function(){
                            var vm = Ext.first('app-exa').getViewModel(),
                                store = vm.getStore('expapprovaldatelist')
                            store.load();
                        }
                    }
                },
                {
                    xtype: 'titlebar',
                    docked: 'bottom',
                    items: [{
                        text: 'Open',
                        ui: 'action',
                        bind: {
                            disabled: '{!approvalDates.selection}'
                        },
                        align: 'right',
                        iconCls: 'x-fa fa-external-link',
                        handler: 'editSelectedExpDate'
                    }]
                }
            ]
        },
        {
            xtype: 'exp-approval-list-panel',
            layout: 'fit',
            title: 'Expense List'
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