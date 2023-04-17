/**
 * Created by steve.tess on 12/1/2016.
 */
Ext.define('TS.view.fwa.ManageUnitDetails', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-manageunitdetails',

    requires: [
        'Ext.grid.plugin.Editable',
        'Ext.util.Format'
    ],

    controller: 'fwa-edit',

    stretchX: true,
    stretchY: true,
    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    listeners: {
        hide: 'closeDetailsSheet'
    },

    bind: {
        disabled: '{fwaUnitsReadOnly}'
    },

    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: 'Mileage Details',
            items: [
                {
                    iconCls: 'x-fa fa-plus',
                    handler: 'addUnitDetails',
                    reference: 'addUnitDetailsButton'
                },
                {
                    align: 'right',
                    text: 'Close',
                    handler: 'closeDetailsSheet'
                }
            ],
            reference: 'topToolbar'
        },
        {
            xtype: 'titlebar',
            docked: 'bottom',
            items: [{
                text: 'Open',
                ui: 'action',
                hidden: true,
                bind: {
                    disabled: '{!unitdetailsGrid.selection}'
                },
                align: 'right',
                iconCls: 'x-fa fa-external-link',
                handler: 'onUnitDetailSelection'
            }]
        },
        {
            xtype: 'grid',
            reference: 'unitDetailsGrid',
            itemId: 'unitDetailsGrid',
            bind: {
                store: '{selectedUnitDetails}',
                selection: '{selectedDetail}'
            },
            emptyText: {_tr: 'unitLabelPlural', tpl: 'Tap plus icon to add mileage details'},
            deferEmptyText: false,
            plugins: {

                type: 'grideditable',

                triggerEvent: 'singletap',
                //set programatically in controller
                //enableDeleteButton: true,

                formConfig: {
                    viewModel: {}, //enables bindings across this form

                    items: [
                        {
                            xtype: 'datepickerfield',
                            itemId: 'unitDetailDate',
                            name: 'dtDate', //this should match dataIndex you would like to edit
                            label: 'Date',
                            bind: {
                                value: '{selectedDetail.dtDate}'
                            }
                        },
                        {
                            xtype: 'textfield',
                            itemId: 'unitDetailFrom',
                            name: 'from',
                            label: 'From',
                            bind: {
                                value: '{selectedDetail.from}'
                            },
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getScrollable();
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 25);
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            itemId: 'unitDetailTo',
                            name: 'to',
                            label: 'To',
                            bind: {
                                value: '{selectedDetail.to}'
                            },
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getScrollable();
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 75);
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'unitDetailLValue1',
                            name: 'lValue1',
                            reference: 'lValue1',
                            label: 'Starting Odometer',
                            stepValue: 1,
                            bind: {
                                value: '{selectedDetail.lValue1}'
                            },
                            listeners: {
                                change: function (me, newValue, oldValue) {
                                    var end = me.getParent().getItems().getRange()[4].getValue(),
                                        ttl = me.getParent().getItems().getRange()[5];
                                    ttl.setValue(end - newValue);
                                },
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getScrollable();
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 125);
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'unitDetailLValue2',
                            name: 'lValue2',
                            reference: 'lValue2',
                            label: 'Ending Odometer',
                            stepValue: 1,
                            bind: {
                                value: '{selectedDetail.lValue2}'
                            },
                            listeners: {
                                change: function (me, newValue, oldValue) {
                                    var start = me.getParent().getItems().getRange()[3].getValue(),
                                        ttl = me.getParent().getItems().getRange()[5];
                                    ttl.setValue(newValue - start);
                                },
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getScrollable();
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 175);
                                }
                            }
                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'unitDetailLValue3',
                            label: 'Miles',
                            reference: 'lValue3',
                            name: 'lValue3',
                            bind: {
                                value: '{selectedDetail.lValue3}'
                            },
                            readOnly: true,
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getScrollable();
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 215);
                                }
                            }
                        },
                        {
                            xtype: 'fieldset',
                            title: 'Description',
                            layout: 'hbox',
                            height: 'auto',
                            userCls: 'ts-wide-fieldset',
                            defaults: {
                                flex: 1,
                                labelAlign: 'top'
                            },
                            items: [
                                {
                                    xtype: 'textareafield',
                                    itemId: 'unitDetailSValue1',
                                    name: 'sValue1',
                                    height: 'auto',
                                    scrollable: 'y',
                                    bind: {
                                        value: '{selectedDetail.sValue1}'
                                    },
                                    listeners: {
                                        focus: function (obj, e) {
                                            var scroller = obj.getParent().getParent().getScrollable();
                                            if (Ext.os.is.Android && Ext.os.is.Phone)
                                                scroller.scrollTo(null, 250);
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'textareafield',
                            readOnly: true,
                            disabled: true,
                            border: false,
                            minHeight: '300px',
                            scrollable: 'y'
                        }
                    ]
                },

                toolbarConfig: {
                    xtype: 'titlebar',
                    docked: 'top',
                    items: [{
                        xtype: 'button',
                        ui: 'decline',
                        text: 'Cancel',
                        align: 'right',
                        action: 'cancel'
                    }, {
                        xtype: 'button',
                        ui: 'confirm',
                        text: 'Save',
                        align: 'left',
                        action: 'submit',
                        reference: 'submitUnitDetailButton'
                    }]
                }
            },

            columns: [
                {
                    xtype: 'datecolumn',
                    text: 'Date',
                    dataIndex: 'dtDate',
                    flex: .9,
                    format: 'n/j/Y',
                    editable: true
                },
                {
                    text: 'Starting Odom',
                    dataIndex: 'lValue1',
                    flex: 1.1
                },
                {
                    text: 'Ending Odom',
                    dataIndex: 'lValue2',
                    flex: 1
                }
            ]
        }
    ]
});