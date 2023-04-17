Ext.define('TS.view.ts.TimesheetSelect', {
    extend: 'Ext.window.Window',
    xtype: 'window-timesheetselect',

    modal: true,
    layout: 'fit',

    items: [{
        xtype: 'grid-timesheet',
        itemId: 'ts-grid',
        store: {
            proxy: {
                type: 'default',
                directFn: 'TimeSheet.GetListByEmployee',
                paramOrder: 'dbi|username|empId|start|limit'
            }
        }
    }],

    plugins: 'responsive',
    responsiveConfig: {
        small: {
            width: 350,
            height: 300
        },
        normal: {
            width: 500,
            height: 500
        }
    },

    title: {_tr: 'tsTitle', tpl: 'Select {0}'}
});
