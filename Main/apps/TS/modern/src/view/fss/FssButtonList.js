Ext.define('TS.view.fss.FssButtonList', {
    extend: 'Ext.Panel',

    xtype: 'fssButtonList',

    layout: {
        type: 'vbox',
        align: 'middle',
        pack: 'center'
    },
    style: 'background-color: white !important;',

    items: [
        {
            xtype: 'panel',
            items:[
                {
                    xtype: 'button',
                    hidden: true,
                    textAlign: 'left',
                    style: 'background-color: white; color: black; font-weight: bold; border: 1px solid white;',
                    iconCls: 'fss-fwa-list',
                    handler: 'onButtonApplicationClick',
                    text: {_tr: 'fwaLabelPlural', tpl: '{0}'},
                    itemId: 'fwaListButton'
                },
                {
                    xtype: 'button',
                    hidden: true,
                    textAlign: 'left',
                    style: 'background-color: white; color: black; font-weight: bold; border: 1px solid white;',
                    iconCls: 'fss-timesheet',
                    handler: 'onButtonApplicationClick',
                    text: {_tr: 'tsTitle', tpl: '{0}s'},
                    itemId: 'tsButton'
                },
                {
                    xtype: 'button',
                    hidden: true,
                    textAlign: 'left',
                    style: 'background-color: white; color: black; font-weight: bold; border: 1px solid white;',
                    iconCls: 'fss-timesheet-approval',
                    handler: 'onButtonApplicationClick',
                    text: {_tr: 'tsTitle', tpl: '{0} Approvals'},
                    itemId: 'tsApprovalButton'
                },
                {
                    xtype: 'button',
                    hidden: true,
                    textAlign: 'left',
                    style: 'background-color: white; color: black; font-weight: bold; border: 1px solid white;',
                    iconCls: 'fss-expenses',
                    handler: 'onButtonApplicationClick',
                    text: 'Expenses',
                    itemId: 'expensesButton'
                },
                {
                    xtype: 'button',
                    hidden: true,
                    textAlign: 'left',
                    style: 'background-color: white; color: black; font-weight: bold; border: 1px solid white;',
                    iconCls: 'fss-expense-approval',
                    handler: 'onButtonApplicationClick',
                    text: 'Expense Approvals',
                    itemId: 'expApprovalButton'
                }
            ]
        },

    ]

});