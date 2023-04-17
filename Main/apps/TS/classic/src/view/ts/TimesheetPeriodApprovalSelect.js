
Ext.define('TS.view.ts.TimesheetPeriodApprovalSelect', {
    extend: 'Ext.window.Window',

    xtype: 'window-timesheetperiodapprovalselect',

    requires: [
        'TS.view.grid.TimesheetPeriod'
    ],

    modal: true,
    layout: 'fit',
    itemId: 'periodSelectWindow',
    items: [{
        xtype: 'grid-timesheetperiod',
        store: {
            proxy: {
                type: 'default',
                directFn: 'TimeSheet.GetTimesheetPeriodsForApproval',
                paramOrder: 'dbi|username'
            },
            listeners: {
                load: function (t, records, successful, message) {
                    var settings = TS.app.settings;
                    if (!successful) {
                        var error = {mdBody: 'Load of Timesheet Periods For Approval failed(' + message.error.mdBody + ')).'};
                        Ext.GlobalEvents.fireEvent('Error', error);
                    }
                }
            }
        }
    }],

    plugins: 'responsive',
    responsiveConfig: {
        small: {
            width: 300,
            maxHeight: 280
        },
        normal: {
            width: 400,
            maxHeight: 400
        }
    },

    title: {_tr: 'tsTitle', tpl: 'Select {0} Period'}
    
});
