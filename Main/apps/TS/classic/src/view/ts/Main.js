Ext.define('TS.view.ts.Main', {
    extend: 'TS.view.main.Main',

    plugins: [{
        ptype: 'printer'
    }],

    xtype: 'viewport-timesheet',

    controller: 'viewport-timesheet',

    viewModel: {
        type: 'timesheet'
    },

    config: {
        layout: 'border',
        items: [
            {
                xtype: 'header-timesheet',
                region: 'north'
            }, {
                xtype: 'panel',
                region: 'center',
                layout: 'fit',
                items: [{
                    xtype: 'grid-timesheetrow'
                }],

                dockedItems: [{
                    xtype: 'toolbar-timesheet',
                    dock: 'top'
                }]
            }
        ]
    }
});