/**
 * Created by steve.tess on 8/26/2015.
 */
Ext.define('TS.view.ts.TimesheetPeriodSelect', {
    extend: 'Ext.window.Window',

    xtype: 'window-timesheetperiodselect',

    modal: true,
    layout: 'fit',

    items: [{
        xtype: 'grid-timesheetperiod',
        store: {
            proxy: {
                type: 'default',
                directFn: 'TimeSheet.GetTimesheetPeriods',
                paramOrder: 'dbi|username'
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
