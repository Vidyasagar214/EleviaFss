Ext.define('TS.view.tsa.EditMenu', {
    extend: 'TS.view.common.Menu',

    xtype: 'tsa-editmenu',

    items: [
        {
            text: 'Approve',
            xtype: 'button',
            iconCls: 'x-fa fa-check-circle',
            handler: 'onMenuApprove'
        },
        {
            xtype: 'spacer',
            height: 10
        },
        {
            text: 'Reject',
            xtype: 'button',
            iconCls: 'x-fa fa-times-circle',
            handler: 'onMenuReject'
        }
    ]

});