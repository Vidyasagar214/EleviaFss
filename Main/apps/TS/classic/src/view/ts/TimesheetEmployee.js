Ext.define('TS.view.ts.TimesheetEmployee', {
    extend: 'Ext.window.Window',

    xtype: 'window-timesheetemployee',

    controller: 'window-timesheetemployee',

    plugins: {
        ptype: 'responsive'
    },
    responsiveConfig: {
        normal: {
            width: 800
        },
        small: {
            width: 400,
            maxHeight: 300
        }
    },

    items: [{
        xtype: 'container',
        scrollable: true,
        items: [{
            xtype: 'grid-timesheetrow',
            isTsApproval: true,
            isViewOnly: this.isViewOnly,
            reference: 'employeeTimesheetGrid'
        }]
    }],

    title: 'Employee Timesheet',
    //width: 750,
    //height: 400,
    layout: 'fit',
    isHidden: null,
    modal: true,

    //Used via getters/ setters in controller
    //TODO: Sencha This typically would belong to ViewModel
    config: {
        endDate: null,
        employeeId: null,
        employeeTimesheet: null,
        tsPeriodId: null,
        isViewOnly: null
    },

    dockedItems: [{
        xtype: 'toolbar-timesheetapproval',
        reference: 'tbEmpTimesheet',
        dock: 'top',
        bind: {
            hidden: '{isHidden}'
        }
    }],
    buttons: [
        '->',
        {
            text: 'Close',
            handler: 'onClickClose',
            reference: 'doCloseButton'
        }
    ],

    listeners: {
        beforeclose: 'onTsEmployeeClose'
    }

});
