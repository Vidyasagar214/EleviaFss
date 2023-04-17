/**
 * Created by steve.tess on 11/30/2016.
 */
Ext.define('TS.view.fwa.ManageUnits', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-manageunits',

    requires: [
        'Ext.grid.plugin.Editable',
        'Ext.plugin.Responsive',
        'Ext.util.Format'
    ],

    controller: 'fwa-edit',
    itemId: 'manageUnits',

    stretchX: true,
    stretchY: true,
    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',

    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            title: {_tr: 'unitLabelPlural'},
            items: [
                {
                    iconCls: 'x-fa fa-plus',
                    handler: 'addUnits',
                    reference: 'addUnitsButton',
                    itemId: 'addButton'
                },
                {
                    align: 'right',
                    text: 'Close',
                    handler: 'closeSheet'
                }
            ],
            reference: 'topToolbar'
        },
        {
            xtype: 'toolbar',
            cls: 'ts-navigation-header',
            reference: 'unitDateBar',
            hidden: false,
            layout: {
                pack: 'center'
            },
            docked: 'top',
            items: [
                {
                    iconCls: 'x-fa fa-arrow-left',
                    handler: 'lastUnitsDate',
                    reference: 'lastUnitsDate',
                    itemId: 'lastUnitsDate',
                    align: 'left'
                },
                {
                    xtype: 'displayfield',
                    cls: 'ts-navigation-header',
                    reference: 'unitsDateHeader',
                    itemId: 'unitsDateHeader',
                    value: 'Date',
                    width: 100,
                    style: 'color: white; white-space: nowrap;'
                },
                {
                    iconCls: 'x-fa fa-arrow-right',
                    handler: 'nextUnitsDate',
                    reference: 'nextUnitsDate',
                    itemId: 'nextUnitsDate',
                    align: 'right'
                },
                {
                    //text: 'Add Date',
                    iconCls: 'x-fa fa-calendar-plus-o',
                    handler: 'onAddUnitsDate',
                    reference: 'addUnitsDate',
                    itemId: 'nextUnitsDate',
                    align: 'right',
                    hidden: true
                }
            ]
        },
        {
            xtype: 'grid',
            reference: 'unitCodeGrid',
            itemId: 'unitCodeGrid',
            bind: {
                store: '{selectedFWA.units}',
                selection: '{selectedUnit}',
                disabled: '{fwaUnitsReadOnly}'
            },
            emptyText: {_tr: 'unitLabelPlural', tpl: 'Tap plus icon to add {0}'},
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
                            name: 'unitDate', //this should match dataIndex you would like to edit
                            itemId: 'unitDate',
                            label: 'Date'
                        },
                        {
                            xtype: 'field-unitcode',
                            itemId: 'unitCodeCombo',
                            autoSelect: false,
                            name: 'unitCodeCombo',
                            reference: 'unitCodeCombo',
                            label: {_tr: 'unitLabel'},
                            bind: {
                                value: '{unitCodeCombo.selection.unitCodeId}',
                                readOnly: '{fwaUnitsReadOnly}'
                            },
                            listeners: {
                                change: function (t, newValue) {
                                    var me = t,
                                        unitCodeStore = Ext.getStore('UnitCode'),
                                        store = Ext.getStore('EquipmentList'),
                                        display;
                                    if (newValue && !IS_OFFLINE) {
                                        store.getProxy().extraParams['unitCodeId'] = newValue.getId();
                                        store.load();
                                    }
                                    if (unitCodeStore && newValue) {
                                        display = unitCodeStore.getById(newValue.get('unitCodeId')).get('requireDetail') == 'M';
                                        me.getParent().getItems().getRange()[7].setHidden(!display);
                                    }
                                }
                            }
                        },
                        {
                            //We have to auto-populate this field once the above one changes
                            xtype: 'hiddenfield',
                            name: 'unitCodeId',
                            bind: '{unitCodeCombo.selection.unitCodeId}'
                        },
                        {
                            xtype: 'displayfield',
                            name: 'unitCodeName',
                            itemId: 'unitCodeName',
                            label: 'Name',
                            bind: {
                                value: '{unitCodeCombo.selection.unitCodeName}' //reference#.selection.field
                            }
                        },
                        {
                            xtype: 'numberfield',
                            name: 'quantity',
                            itemId: 'quantity',
                            label: 'Quantity',
                            stepValue: 1,
                            bind: {
                                value: '{selectedUnit.quantity}' //reference#.selection.field
                            },
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getScrollable();
                                    TS.app.settings.currentPosition = scroller.position.y;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 120);
                                },
                                blur: function(obj, e){
                                    var scroller = obj.getParent().getScrollable();
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, TS.app.settings.currentPosition);
                                }
                            }
                        },
                        {
                            xtype: 'field-equipment',
                            autoSelect: false,
                            label: 'Equipment',
                            itemId: 'equipmentName',
                            reference: 'equipmentCombo',
                            name: 'equipmentName',
                            //bind: '{equipmentCombo.selection.equipmentName}'
                        },
                        {
                            xtype: 'textareafield',
                            itemId: 'unitComments',
                            name: 'comments',
                            label: 'Comments',
                            maxLength: 255,
                            hidden: false,
                            listeners: {
                                focus: function (obj, e) {
                                    var scroller = obj.getParent().getScrollable();
                                    TS.app.settings.currentPosition = scroller.position.y;
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, 220);
                                },
                                blur: function(obj, e){
                                    var scroller = obj.getParent().getScrollable();
                                    if (Ext.os.is.Android && Ext.os.is.Phone)
                                        scroller.scrollTo(null, TS.app.settings.currentPosition);
                                }
                            }
                        },
                        {
                            //We have to auto-populate this field once the above one changes
                            xtype: 'hiddenfield',
                            name: 'equipmentId',
                            itemId: 'unitEquipmentId',
                            bind: '{equipmentCombo.selection.equipmentId}'
                        },
                        {
                            xtype: 'button',
                            text: 'Details',
                            iconCls: 'x-fa fa-car',
                            itemId: 'onUnitDetailsButton',
                            reference: 'onUnitDetailsButton',
                            action: 'showUnitDetails'
                        },
                        {
                            xtype: 'button',
                            name: 'dummy',
                            text: '  ',
                            height: 300,
                            listeners: {
                                painted: function(obj){
                                    if(Ext.os.is.Android && Ext.os.is.Phone){
                                        obj.hidden = false;
                                    } else {
                                        obj.hidden = true;
                                    }
                                }
                            }
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
                        reference: 'submitUnitButton'
                    }]
                }
            },

            columns: [
                {
                    text: {_tr: 'unitLabel'},
                    dataIndex: 'unitCodeId',
                    flex: 1,
                    renderer: function (value) {
                        var record = Ext.getStore('UnitCode').getById(value);
                        return (record ? record.get('unitCodeAbbrev') : 'N/A');
                    },
                    plugins: 'responsive',
                    responsiveConfig: {
                        portrait: {
                            hidden: true
                        },
                        landscape: {
                            hidden: false
                        }
                    }
                },
                {
                    text: 'Name',
                    dataIndex: 'unitCodeId',
                    flex: 2,
                    renderer: function (value) {
                        var record = Ext.getStore('UnitCode').getById(value);
                        return (record ? record.get('unitCodeName') : 'N/A');
                    }
                },
                {
                    xtype: 'datecolumn',
                    reference: 'unitDateField',
                    format: 'n/j/Y',
                    editable: false,
                    text: 'Date',
                    dataIndex: 'unitDate',
                    flex: 1.5,
                    hidden: true
                },
                {
                    text: 'Equipment',
                    dataIndex: 'equipmentName',
                    itemId: 'gridEquipmentName',
                    flex: 2,
                },
                {
                    text: 'Qty',
                    dataIndex: 'quantity',
                    flex: 1
                }
            ]
        }
    ]

});