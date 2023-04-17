Ext.define('TS.view.fwa.Toolbar', {
    extend: 'Ext.Toolbar',
    xtype: 'toolbar-fwa',

    layout: {
        type: 'hbox',
        pack: 'center'
    },
    enableOverflow: true,
    //cls: 'toolbar-background',

    items: [
        // {
        //     text: 'Start',
        //     handler: 'toggleWork',
        //     bind: {
        //         text: '{fwaStartStop}',
        //         hidden: '{hideFwaStartStop}'
        //     },
        //     reference: 'toggleWorkButton',
        //     itemId: 'toggleWorkButton'
        // },
        {
            text: 'Copy',
            //iconCls: 'copy',
            handler: 'doCopyFwa',
            bind: {
                hidden: '{newFwa}'
            },
            tooltip: {_tr: 'fwaAbbrevLabel', tpl: 'Copy {0}'},
            reference: 'doCopyFwaButton'
        },
        {
            text: 'View Timesheet',
            handler: 'showTimesheetExternal',
            //iconCls: 'timesheet',
            bind: {
                hidden: '{isSchedulerOrNewFwa}'
            },
            reference: 'showTimesheetExternalButton',
            itemId: 'showTimesheetExternalButton'
        },
        {
            text: 'Print',
            //iconCls: 'printer',
            handler: 'showPrinter',
            bind: {
                hidden: '{newFwa}'
            },
            tooltip: {_tr: 'fwaAbbrevLabel', tpl: 'Print {0}'},
            reference: 'showPrintButton',
            itemId: 'showPrintButton'
        },
        {
            text: 'Email',
            //iconCls: 'email',
            handler: 'showEmailWindow',
            tooltip: {_tr: 'fwaAbbrevLabel', tpl: 'Send email with {0}'},
            reference: 'showEmailWindowButton',
            itemId: 'showEmailWindowButton',
            bind: {
                hidden: '{newFwa}'
            }
        },
        {
            text: 'Attach Doc',
            //iconCls: 'document',
            handler: 'showAttachDocWindow',
            bind: {
                //hidden: '{newFwa}'
            },
            reference: 'showAttachDocButton',
            itemId: 'showAttachDocButton'
        },
        {
            text: 'Attach Photo',
            //iconCls: 'camera-add',
            handler: 'showAttachPhotoWindow',
            bind: {
                //hidden: '{newFwa}'
            },
            reference: 'showAttachPhotoButton',
            itemId: 'showAttachPhotoButton'
        },
        {
            text: 'Actions',
            //iconCls: 'action-list',
            handler: 'prePostFwaActions',
            bind: {
                hidden: '{!settings.fwaDisplayActionsbutton}'
            },
            itemId: 'actionsButton',
            reference: 'actionsButton'
        },
        {
            text: 'Update',
            reference: 'fwaUpdateButton',
            itemId: 'fwaUpdateButton',
            //iconCls: 'save',
            handler: 'updateFwaForm',
            // plugins: [{
            //     ptype: 'permission',
            //     disableCmp: true,
            //     roles: ['!CrewMember']
            // }]
        },
        {
            text: 'Save',
            reference: 'fwaSaveButton',
            //iconCls: 'save',
            handler: 'saveFwaForm',
            // plugins: [{
            //     ptype: 'permission',
            //     disableCmp: true,
            //     roles: ['!CrewMember']
            // }]
        },
        {
            text: 'Submit',
            reference: 'fwaSubmitButton',
            //iconCls: 'submit',
            handler: 'saveFwaForm',
            bind: {
                hidden: '{newFwa}' //false //'{isSchedulerOrNewFwa}'
            },
            plugins: [{
                ptype: 'permission',
                disableCmp: true,
                roles: ['!CrewMember']
            }]
        },
        {
            text: 'Approve',
            reference: 'fwaApproveButton',
            //iconCls: 'approve',
            handler: 'approveFwaForm',
            disabled: true
        },
        {
            text: 'Remove',
            handler: 'removeFwaForm',
            reference: 'removeFwaFormButton'
        },
        {
            text: 'Search',
            //iconCls: 'search',
            handler: 'showSearchWindow',
            tooltip: {_tr: 'fwaAbbrevLabel', tpl: 'Search for matching {0}s'},
            reference: 'searchButton',
            itemId: 'searchButton'
            // bind: {
            //     hidden: '{newFwa}'
            // }
        }
    ]
});
