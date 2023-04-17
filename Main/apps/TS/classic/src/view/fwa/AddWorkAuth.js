/**
 * Created by steve.tess on 5/8/2017.
 */
Ext.define('TS.view.fwa.AddWorkAuth', {
    extend: 'Ext.window.Window',

    xtype: 'window-addworkauth',

    modal: true,
    layout: 'fit',

    constrainHeader: true,
    controller: 'grid-workauth',
    reference: 'addWorkAuth',
    itemId: 'addWorkAuth',

    plugins: 'responsive',
    //scrollable: true,

    title: {_tr: 'workCodeLabelPlural', tpl: 'Add {0}'},
    titleAlign: 'center',

    items: [
        {
            xtype: 'form',
            reference: 'addWorkAuthForm',
            items:[
                {
                    xtype: 'fieldset',
                    title: {_tr: 'workCodeLabel', tpl: 'Add {0}'},
                    margin: '10 10 10 10',
                    items:[
                        {
                            xtype: 'field-workcode',
                            fieldLabel: {_tr: 'workCodeLabel'},
                            reference: 'addWorkCodeField',
                            listeners:{
                                dirtychange: 'addWorkCodeChanged'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: 'Scheduled',
                            reference: 'addScheduledField',
                            minValue: 0
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'numberfield',
                            fieldLabel: 'Actual',
                            reference: 'addActualField',
                            minValue: 0,
                            bind: {
                                hidden: '{fwaHideActualHours}'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: {_tr: 'workDescriptionLabel'},
                            reference: 'addDescriptionField',
                            readOnly: true
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            fieldLabel: '% Complete',
                            xtype: 'numberfield',
                            minValue: 0,
                            bind: {
                                hidden: '{!settings.fwaDisplayWorkCodePctComplete}'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Comments',
                            reference: 'addCommentsField'
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'checkbox',
                            fieldLabel: 'Photo Req',
                            reference: 'addPhotoReqField',
                            tooltip: 'Photo Required',
                            bind: {
                                disabled: '{!isSchedulerOrNewFwa}',
                                hidden: '{!isSchedulerOrNewFwa}'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        }
                    ]
                }

            ]
        }
    ],

    buttons: [
        '->',
        {
            text: 'Save',
            //iconCls: 'save',
            itemId: 'saveWorkCode',
            handler: 'saveNewWorkCode',
            listeners: {
                mouseover: function (btn) {
                    btn.focus();
                }
            },
            disabled: true
        },
        {
            text: 'Cancel',
            //iconCls: 'reject-ts',
            handler: 'cancelNewWorkCode'

        }
    ]
});