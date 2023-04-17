/**
 * Created by steve.tess on 4/21/2017.
 */
Ext.define('TS.view.fwa.RecurrenceDates', {
    extend: 'Ext.window.Window',

    xtype: 'window-recurrencedates',

    requires: [
        'TS.controller.fwa.RecurrenceDatesController',
        'TS.model.shared.Dates',
        'TS.store.AddlDates',
        'TS.store.ExceptDates'
    ],

    controller: 'recurrencedates',

    modal: true,
    title: 'Recurrence Date Exceptions',
    plugins: {
        ptype: 'responsive'
    },
    scrollable: true,
    responsiveConfig: {
        small: {
            width: 300,
            height: 360
        },
        normal: {
            width: 400,
            height: 360
        }
    },

    items: [
        {
            xtype: 'fieldset',
            border: false,
            margin: 5,
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'grid',
                            scrollable: true,
                            itemId: 'exceptDatesGrid',
                            store: {
                                model: 'TS.model.shared.Dates',
                                sorters: [{
                                    property: 'myDate',
                                    direction: 'ASC'
                                }]
                            },
                            plugins: [{
                                ptype: 'cellediting',
                                clicksToEdit: 1
                            }],
                            maxHeight: 275,
                            margin: 5,
                            flex: 1,
                            columns: [
                                {
                                    text: 'Except Dates',
                                    dataIndex: 'myDate',
                                    xtype: 'datecolumn',
                                    editor: 'datefield',
                                    format: DATE_FORMAT,
                                    flex: 1
                                }, {
                                    xtype: 'actioncolumn',
                                    width: 25,
                                    resizable: false,
                                    menuDisabled: true,
                                    items: [{
                                        iconCls: 'x-fa fa-trash',
                                        tooltip: 'Delete',
                                        handler: 'deleteDate'
                                    }]
                                }
                            ],
                            bbar: [{
                                xtype: 'button',
                                reference: 'exceptDates',
                                handler: 'onExceptDates',
                                iconCls: 'workitem-add',
                                toolTip: 'Add except date'
                            }]

                        },
                        {
                            xtype: 'grid',
                            scrollable: true,
                            itemId: 'addlDatesGrid',
                            store: {
                                model: 'TS.model.shared.Dates',
                                sorters: [{
                                    property: 'myDate',
                                    direction: 'ASC'
                                }]
                            },
                            plugins: [{
                                ptype: 'cellediting',
                                clicksToEdit: 1
                            }],
                            maxHeight: 275,
                            margin: 5,
                            flex: 1,
                            columns: [
                                {
                                    text: 'Add\'l Dates',
                                    dataIndex: 'myDate',
                                    xtype: 'datecolumn',
                                    editor: 'datefield',
                                    format: DATE_FORMAT,
                                    flex: 1
                                }, {
                                    xtype: 'actioncolumn',
                                    width: 25,
                                    resizable: false,
                                    menuDisabled: true,
                                    items: [{
                                        iconCls: 'x-fa fa-trash',
                                        tooltip: 'Delete',
                                        handler: 'deleteDate'
                                    }]
                                }
                            ],
                            bbar: [{
                                xtype: 'button',
                                reference: 'addlDates',
                                handler: 'onAddlDates',
                                iconCls: 'workitem-add',
                                toolTip: 'Add additional date'
                            }]
                        }
                    ]
                }
            ]
        }
    ],

    buttons: [
        {
            text: 'Update',
            handler: 'onUpdateRecurrenceDates',
            listeners: {
                mouseover: function (btn) {
                    btn.focus();
                }
            }
        },
        '->',
        {
            text: 'Cancel',
            handler: 'onCancelRecurrenceDates',
            listeners: {
                mouseover: function (btn) {
                    btn.focus();
                }
            }
        }
    ]
});