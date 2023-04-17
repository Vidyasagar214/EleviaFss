/*
 * This is the toolbar that contains controls specify to manipulating timesheet rows
 * Usually attached beneath the TimesheetRow grid
 * Inherited ViewController: *.controller.view.grid.TimesheetRow
 */

Ext.define('TS.common.toolbar.TimesheetRow', {
    extend: 'Ext.Toolbar',
    xtype: 'toolbar-timesheetrow',

    ui: 'darkblue',

    config: {
        defaults: {
            xtype: 'button'
        },
        items: [{
            text: 'Insert New Row',
            iconCls: 'workitem-add',
            handler: 'startNewTimesheetRow'
        }]
    }
});
