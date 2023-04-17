Ext.define('TS.common.toolbar.Timesheet', {
    extend: 'Ext.Toolbar',
    xtype: 'toolbar-timesheet',

    enableOverflow: true,
    //cls: 'toolbar-background',
    defaults: {
        xtype: 'button'
    },

    items: [{
        text: 'New Entry',
        iconCls: 'x-fa fa-plus-circle',
        handler: 'startNewTimesheetRow',
        reference: 'newEntryBtn'
    }, {
        xtype: 'tbspacer',
        flex: 1
    }, {
        text: 'Open',
        handler: 'showTimesheetWindow'
    }, {
        text: 'Copy',
        handler: 'showCopyWindow',
        reference: 'copyBtn'
    }, {
        text: 'Show',
        arrowAlign: 'right',
        hidden: true, // Temp hidden per client specs
        menu: [{
            text: 'Ratio',
            iconCls: '', // TODO - Add icon
            handler: Ext.emptyFn // TODO - Add and implement the handler in ViewController
        }, {
            text: 'Benefit Hours',
            iconCls: '', // TODO - Add icon
            handler: Ext.emptyFn // TODO - Add and implement the handler in ViewController
        }]
    }, {
        text: 'Print',
        handler: 'showPrintWindow'
    }, {
        text: 'Email',
        handler: 'showEmailWindow'
    }, {
        id: 'btnTsSave', //TODO Remove id!
        text: 'Save',
        handler: 'doSaveTimesheet',
        reference: 'saveBtn'
    }, {
        id: 'btnTsSubmit', //TODO Remove id!
        text: 'Submit',
        handler: 'doSubmitTimesheet',
        reference: 'submitBtn'
    }, {
        xtype: 'tbspacer',
        flex: 1
    },
        '->',
        {
            iconCls: 'x-fa fa-info-circle',
            width: 25,
            handler: 'openAboutFss',
            tooltip: 'About FSS'
        }]

});
