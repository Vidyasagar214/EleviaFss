Ext.define('TS.view.ts.TimesheetEmployees', {
    extend: 'Ext.window.Window',
    xtype: 'window-timesheetemployees',

    items: [{
        xtype: 'grid-employee'
    }],

    title: 'Employees',
    width: 500,
    height: 350,
    layout: 'fit',

    buttons: [{
        xtype: 'combobox',
        fieldLabel: 'Timesheet Ending:',
        labelWidth: 130,
        store: {}
    }, '->', {
        text: 'Close',
        handler: function () {
            this.up('window').close();
        }
    }]
});
