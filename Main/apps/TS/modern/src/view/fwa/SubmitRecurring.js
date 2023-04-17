/**
 * Created by steve.tess on 6/10/2019.
 */
Ext.define('TS.view.fwa.SubmitRecurring', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-submit-recurring',

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,

    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'panel',
            layout: 'fit',
            items: [
                {
                    xtype: 'titlebar',
                    docked: 'top',
                    cls: 'ts-navigation-header',
                    reference: 'udfTitle',
                    title: {_tr: 'fwaAbbrevLabel', tpl: 'Recurring {0}'},
                    items: [
                        {
                            align: 'right',
                            text: 'Close',
                            handler: 'closeSubmitRecurringSheet'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        pack: 'middle'
                    },
                    items: [
                        {
                            xtype: 'datepickerfield',
                            border: true,
                            style: 'border-top: 1px solid grey; border-bottom: 1px solid grey; border-left: 1px solid grey; border-right: 1px solid grey;',
                            label: {_tr: 'fwaAbbrevLabel', tpl: ' Submit {0} through'},
                            labelWidth: 175,
                            itemId: 'selectedDate',
                            reference: 'selectedDate',
                            value: new Date(),
                            //bind: '{selectedFWA.nextDate}',
                            picker: {
                                yearFrom: 2019,
                                yearTo: new Date().getFullYear() + 2
                            }
                        },
                        {
                            xtype: 'checkboxfield',
                            border: true,
                            style: 'border-bottom: 1px solid grey; border-left: 1px solid grey; border-right: 1px solid grey;',
                            label: {_tr: 'fwaAbbrevLabel', tpl: ' Submit Entire {0}'},
                            labelWidth: 175,
                            reference: 'submitEntireFwaCbx',
                            listeners:{
                                change:  function(obj, newValue, oldValue, eOpts){
                                    Ext.first('#selectedDate').setDisabled(newValue);
                                }
                            }
                        },
                        {
                            xtype: 'titlebar',
                            docked: 'bottom',
                            items: [
                                {
                                    text: 'Submit',
                                    align: 'left',
                                    //ui: 'action',
                                    iconCls: 'x-fa fa-save',
                                    handler: 'continueSubmitRecurringFwa',
                                    reference: 'submitFwaButton'
                                },
                                {
                                    text: 'Cancel',
                                    align: 'right',
                                    ui: 'action',
                                    iconCls: 'x-fa  fa-times-circle-o',
                                    handler: 'closeSubmitRecurringSheet'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]

});