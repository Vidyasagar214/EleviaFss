Ext.define('TS.common.toolbar.TimesheetApproval', {
    extend: 'Ext.Toolbar',
    xtype: 'toolbar-timesheetapproval',

    style: 'background-color: #21639c !important;',

    config: {
        defaults: {
            xtype: 'button'
        },
        items: [{
            text: 'New Entry',
            iconCls: 'x-fa fa-plus-circle',
            handler: 'startNewTimesheetRow',
            reference: 'newEntryBtn',
            bind:{
                hidden: '{!tsApproverCanModify}'
            }
        }, {
            text: 'Save',
            handler: 'onSaveTimesheet',
            bind:{
                hidden: '{!tsApproverCanModify}'
            }
        }, {
            text: 'Submit',
            handler: 'onSubmitTimesheet',
            bind:{
                hidden: '{!tsApproverCanModify}'
            }
        }, '->', {
            text: 'Approve',
            handler: 'approveTimesheet',
            bind:{
                hidden: '{tsStatus}'
            }
        }, {
            text: 'Reject',
            handler: 'rejectTimesheet',
            bind:{
                hidden: '{tsStatus}'
            }
        }, '->', {
            text: 'View All',
            handler: 'onClose'
        }]
    }
});
