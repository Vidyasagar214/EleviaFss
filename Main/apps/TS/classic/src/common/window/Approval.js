Ext.define('TS.common.window.Approval', {
    extend: 'Ext.window.Window',

    controller: 'window-approval',

    xtype: 'window-approval',
    reference: 'tsApprovalWindow',
    plugins: {
        ptype: 'responsive'
    },
    responsiveConfig: {
        normal: {
            width: 700
        },
        small: {
            width: 360
        }
    },

    selectedTsheet: null,

    config: {
        title: 'Timesheet Summary',
        autoHeight: true,
        layout: 'fit',
        top: 270,
        height: 400,

        items: [{
            xtype: 'grid-approval',
            reference: 'tsApprovalGrid'
        }]
    }
});
