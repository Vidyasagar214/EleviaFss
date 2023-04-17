Ext.define('TS.view.ts.TimesheetHeader', {
    extend: 'Ext.Toolbar',
    xtype: 'header-timesheet',

    //cls: 'toolbar-background',
    //style: 'background: #1468a2 !important;',
    //style: 'background-color: #1468A2 !important;',
    width: '100%',

    items: [
        {
            xtype: 'button',
            width: 70,
            iconCls: 'x-fa fa-home',
            align: 'left',
            handler: 'onBackToFSS',
            bind: {
                hidden: '{!fromFSS}'
            },
            tooltip: 'FSS application list'
        },
        {
            xtype: 'label',
            style: 'color: white; font-size: 20px !important;',
            padding: '0 0 0 20',
            bind: {
                html: '{settings.empName}'
            }
        },
        '->',
        {
            xtype: 'label',
            style: 'color: white;  font-size: 20px !important;',
            bind: {
                html: '{formatDateRange}'
            }
        }
    ]
});
