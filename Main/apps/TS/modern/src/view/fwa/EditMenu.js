Ext.define('TS.view.fwa.EditMenu', {
    extend: 'TS.view.common.Menu',
    xtype: 'fwa-editmenu',

    reference: 'fwaEditMenu',
    scrollable: 'y',
    //maxHeight: 300,
    items: [
        {
            text: 'Copy',
            xtype: 'button',
            reference: 'fwaCopyButton',
            itemId: 'fwaCopyButton',
            iconCls: 'x-fa fa-copy',
            handler: 'doCopyFwa',
            bind: {
                hidden: '{isNewOrHideCopy}'
            }
        },
        // {
        //     text: 'Print',
        //     xtype: 'button',
        //     reference: 'fwaPrintButton',
        //     itemId: 'fwaPrintButton',
        //     iconCls: 'x-fa fa-print',
        //     handler: 'onPrint',
        //     bind: {
        //         hidden: '{newFwa}'
        //     }
        // },
        {
            text: 'Email',
            reference: 'fwaEmailButton',
            itemId: 'fwaEmailButton',
            iconCls: 'x-fa fa-envelope-o',
            handler: 'onOpenEmail',
            bind: {
                hidden: '{isNewOrOffline}'
            }
        },
        // {
        //     xtype: 'spacer',
        //     height: 0
        // },
        {
            text: 'Doc',
            xtype: 'button',
            reference: 'fwaDocButton',
            itemId: 'fwaDocButton',
            iconCls: 'x-fa fa-file-text-o',
            handler: 'onAttachDoc',
            bind: {
                hidden: '{newFwa}'
            }
        },
        {
            text: 'Photo',
            xtype: 'button',
            reference: 'fwaPhotoButton',
            itemId: 'fwaPhotoButton',
            iconCls: 'x-fa fa-camera',
            handler: 'onAttachPhoto',
            bind: {
                hidden: '{newFwa}'
            }
        },
        {
            text: 'Approve',
            iconCls: 'x-fa fa-check-square-o',
            reference: 'fwaApproveButton',
            itemId: 'approveFwaButton',
            handler: 'approveFwaForm',
            disabled: true,
            bind: {
                hidden: '{notIsSchedulerAndNewFwa}'
            }
        },
        {
            text: 'Remove',
            iconCls: 'x-fa fa-trash',
            reference: 'fwaRemoveButton',
            itemId: 'removeFwaButton',
            handler: 'removeFwaForm',
            bind: {
                hidden: '{notIsSchedulerAndNewFwa}'
            }
        },
        {
            text: {_tr: 'fwaAbbrevLabel', tpl: 'New {0}'},
            iconCls: 'x-fa fa-file-o',
            action: 'create-fwa', // this action will be handled on main controller
            reference: 'fwaCreateButton',
            itemId: 'fwaCreateButton',
            bind: {
                hidden: '{isNewOrHideCreate}'
            }
        },
        {
            text: 'Search',
            iconCls: 'x-fa fa-search',
            itemId: 'fwaSearchButton',
            handler: 'searchFwaForm',
            bind: {
                hidden: '{newFwa}' //TODO look at hide
            }
        }
    ]
});