Ext.define('TS.view.tsa.Main', {
    extend: 'TS.view.main.Main',

    xtype: 'viewport-timesheetapproval',

    controller: 'timesheetapproval',

    viewModel: {
        type: 'timesheetapproval'
    },

    plugins: [{
        ptype: 'printer'
    }],

    layout: 'border',
    items:[
        {
            xtype: 'header-timesheet',
            region: 'north'
        },
        {
            xtype: 'header-tsa',
            region: 'north'
        },
        {
            xtype: 'grid-approval',
            reference: 'tsApprovalGrid',
            region: 'center'
        },
        {
            xtype:'footer-tsa',
            region: 'south'
        }
    ]
  });