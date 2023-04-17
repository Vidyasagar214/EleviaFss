/**
 * Created by steve.tess on 8/23/2018.
 */
Ext.define('TS.view.exa.ApproveReject', {
    extend: 'Ext.Sheet',
    xtype: 'exp-approvereject',

    stretchX: true,
    stretchY: true,

    approvalType: null,

    autoDestroy: true,

    fullscreen: true,
    layout: 'card',

    items: [
        {
            xtype: 'titlebar',
            itemId: 'approveRejectTitleText',
            cls: 'ts-navigation-header',
            title: 'ApproveReject', //set in controller method (Approve or Reject)
            docked: 'top',
            items: [
                {
                    xtype: 'button',
                    text: 'Back',
                    iconCls: 'x-fa fa-chevron-left',
                    align: 'left',
                    handler: 'onCloseSheet'
                }
            ]
        },
        {
            xtype: 'formpanel',
            layout: {
                type: 'vbox',
                pack: 'middle'
            },
            items:[
                {
                    xtype: 'component',
                    itemId: 'approveRejectCommentText',
                    margin: '0 10 10 10',
                    html: 'Please provide a comment for your approval.'
                },
                {
                    xtype: 'fieldset',
                    items:[
                        {
                            xtype: 'textareafield',
                            itemId: 'approveRejectComment'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [
                {
                    align: 'left',
                    text: 'Save',
                    ui: 'action',
                    iconCls: 'x-fa fa-save',
                    style: 'margin-right: 5px;',
                    handler: 'sendApproveReject'
                },
                {
                    text: 'Cancel',
                    align: 'right',
                    ui: 'decline',
                    iconCls: 'x-fa  fa-times-circle-o',
                    handler: 'onCloseSheet'
                }
            ]
        }
    ]
});