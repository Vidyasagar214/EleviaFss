Ext.define('TS.view.tsa.Main', {
    extend: 'TS.view.main.Main',

    xtype: 'app-tsa',
    fullscreen: true,

    controller: 'tsa-main',
    viewModel: 'tsa-main',

    header: {
        hidden: true
    },

    items: [
        {
            xtype: 'container',
            layout: 'fit',
            title: 'Main card', //will be invisible as we are hiding the tab bar
            items:[
                {
                    xtype: 'titlebar',
                    cls: 'ts-navigation-header',
                    docked: 'top',
                    title: {_tr: 'tsTitle', tpl: 'Select {0} Period'},
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
                    xtype: 'tsa-list',
                    reference: 'timesheets',
                    bind: {
                        store: '{tsasheet}',
                        selection: '{selectedTSA}'
                    },
                    style: 'border-bottom:1px solid #ccc',
                    flex: 1,
                    listeners: {
                        itemsingletap: 'editSelectedTimesheetPeriod',
                        painted: function(){
                            var me = this,
                                store = me.getStore('tsasheet');
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
                            disabled: '{!timesheets.selection}'
                        },
                        align: 'right',
                        iconCls: 'x-fa fa-external-link',
                        handler: 'editSelectedTimesheetPeriod'
                    }]
                }
            ]
        },
        {
            xtype: 'tsa-approvallist',
            title: {_tr: 'tsTitle', tpl: '{0} Approvals' },            
            style: 'border-bottom:1px solid #ccc'
        },
        {
            xtype: 'tsa-timesheet',
            title: 'ApprovalTimesheet'
        },
        {
            xtype: 'ts-hours',
            title: 'Approval Hours'
        },
        {
            xtype: 'ts-edit-hours',
            title: 'Edit Approval Hours'
        }
    ]


});