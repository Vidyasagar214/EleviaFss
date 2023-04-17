Ext.define('TS.view.common.TimesheetHeader', {
    extend: 'Ext.Toolbar',
    xtype: 'header-timesheetxx',

    //cls: 'main-header',
    //ui: 'header',

    width: '100%',

    items: [
        {
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
            bind: {
                html: '{settings.empName}'
            }
        },
        '->',
        {
            xtype: 'label',
            style: 'background-color:#9EC7EA;',
            bind: {
                html: '{formatDateRange}'
            }
        }
    ]
});
