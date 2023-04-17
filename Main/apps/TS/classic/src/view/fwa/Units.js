/**
 * Created by steve.tess on 11/22/2016.
 */
Ext.define('TS.view.fwa.Units', {
    extend: 'Ext.grid.Panel',

    xtype: 'grid-unit',

    requires: [
        'TS.Messages',
        'TS.common.field.UnitCode',
        'TS.controller.fwa.UnitsController',
        'TS.model.fwa.Unit',
        'TS.store.UnitCode'
    ],

    cls: 'fwaunitgrid',
    reference: 'fwaUnitGrid',
    itemId: 'fwaUnitGrid',
    controller: 'grid-units',

    maxHeight: 250,
    config: {
        readOnlyGrid: true // Custom property
    },

    store: {
        model: 'TS.model.fwa.Unit',
        sorters: [
            {
                property: 'unitDate',
                direction: 'ASC'
            },
            {
                property: 'unitSeq',
                direction: 'ASC'
            }
        ],
        sortOnLoad: false
    },

    plugins: [{
        ptype: 'cellediting',
        clicksToEdit: 1
    }],

    viewConfig: {
        columnLines: false,
        markDirty: false,
        listeners: {
            refresh: function (dataview) {
                Ext.each(dataview.panel.columns, function (column) {
                    if (column.autoSizeColumn === true)
                        column.autoSize();
                })
            }
        }
    },
    //
    // bind:{
    //     disabled: '{fwaUnitsReadOnly}'
    // },

    columns: [
        {
            dataIndex: 'unitCodeId',
            hidden: true
        },
        {
            dataIndex: 'unitSeq',
            hidden: true,
            text: 'Seq',
            sortable:false,
            width: 40
        },
        {
            xtype: 'datecolumn',
            editor: 'datefield',
            text: 'Date',
            dataIndex: 'unitDate',
            align: 'center',
            hidden: true
        },
        {
            text: {_tr: 'unitLabel'},
            style: 'border-left: 1px solid #b0b0b0 !important;',
            sortable: true,
            editor: {
                xtype: 'field-unitcode',
                bind: {
                    disabled: '{fwaUnitsReadOnly}'
                },
                listeners: {
                    dirtychange: 'unitChanged'
                }

            },
            dataIndex: 'unitCodeId',
            menuDisabled: true,
            autoSizeColumn: true,
            minWidth: 75,
            renderer: function (value, meta, record, rowIndex) {
                meta.style = "border-left: 1px solid #b0b0b0 !important;";
                if (!record.get('unitCodeId')) return '';
                var unitCode = Ext.getStore('UnitCode').getById(value);
                return (unitCode ? unitCode.get('unitCodeAbbrev') : '');
            },
            // bind: {
            //     disabled: '{fwaUnitsReadOnly}'
            // },
            listeners: {
                focus: function (t, e) {
                    var settings = TS.app.settings;
                    if (settings.fwaUnitVisibility == 'R') {
                        t.setDisabled(true);
                    }
                }
            }
        },
        {
            text: 'Name',
            sortable: true,
            dataIndex: 'unitCodeId',
            menuDisabled: true,
            autoSizeColumn: true,
            minWidth: 150,
            renderer: function (value, metaData, record, rowIndex) {
                if (!record.get('unitCodeId')) return '';
                var unitCode = Ext.getStore('UnitCode').getById(value);
                return (unitCode ? unitCode.get('unitCodeName') : '');
            }
        },
        {
            text: 'Qty',
            minWidth: 55,
            editor: {
                xtype: 'numberfield',
                minValue: 0,
                bind: {
                    disabled: '{fwaUnitsReadOnly}'
                },
                listeners: {
                    dirtychange: 'unitChanged'
                }
            },
            dataIndex: 'quantity',
            menuDisabled: true,
            autoSizeColumn: true
            // bind: {
            //     disabled: '{fwaUnitsReadOnly}'
            // }
        },
        {
            text: 'Equipment',
            dataIndex: 'equipmentId',
            menuDisabled: true,
            getEditor: function (record) {
                return Ext.create('Ext.grid.CellEditor', {
                    field: Ext.create('Ext.form.field.ComboBox', {
                        valueField: 'equipmentId',
                        matchFieldWidth: false,
                        displayField: 'equipmentName',
                        forceSelection: true,
                        queryMode: 'remote',
                        store: {
                            model: 'TS.model.shared.EquipmentList',
                            proxy: {
                                type: 'default',
                                directFn: 'Equipment.GetList',
                                paramOrder: 'dbi|username|start|limit|unitCodeId',
                                extraParams: {
                                    unitCodeId: record.get('unitCodeId')
                                }
                            }
                        },
                        listeners: {
                            change: function (obj, nValue, oValue) {
                                if(obj.rawValue != '')
                                    record.set('equipmentName', obj.rawValue);
                            },
                            dirtychange: 'unitChanged'
                        },
                        bind: {
                            readOnly: '{fwaUnitsReadOnly}'
                        }
                    })
                })
            },
            //editor: 'field-equipmentlist',
            renderer: function (value, metaData, record, rowIndex) {
                return record ? record.get('equipmentName') : '';
            },
            plugins: 'responsive',
            responsiveConfig: {
                small: {
                    flex: 1
                },
                normal: {
                    flex: 2
                }
            }
        },
        {
            hidden: true,
            dataIndex: 'equipmentName'
        },
        {
            text: 'Comments',
            editor: {
                xtype: 'textfield',
                enforceMaxLength: true,
                maxLength: 255,
                bind: {
                    disabled: '{fwaUnitsReadOnly}'
                },
                listeners: {
                    dirtychange: 'unitChanged'
                }
            },
            sortable: true,
            dataIndex: 'comments',
            menuDisabled: true,
            plugins: 'responsive',
            responsiveConfig: {
                small: {
                    flex: 1
                },
                normal: {
                    flex: 3
                }
            }
            // bind: {
            //     disabled: '{fwaUnitsReadOnly}'
            // }
        },
        {
            xtype: 'actioncolumn',
            width: 30,
            resizable: false,
            menuDisabled: true,
            align: 'center',
            items: [{
                reference: 'mileageButton',
                handler: 'calculateUnitMileage',
                iconCls: 'x-fa fa-file greyIcon',
                tooltip: 'Calculate Mileage Details',
                isDisabled: function (view, rowIndex, colIndex, item, record) {
                    var unitCode = Ext.getStore('UnitCode').getById(record.get('unitCodeId')),
                        fwaRecord = Ext.first('form-fwa').getRecord(),
                        settings = TS.app.settings;

                    if ((settings.fwaCanModify == 'A' ||
                        (settings.fwaCanModify == 'M' && fwaRecord.get('scheduledCrewChiefId') == settings.empId) ||
                        (fwaRecord.get('fwaApprovers').indexOf(settings.empId) !== -1 && fwaRecord.get('fwaApproversCanModify')))
                        && unitCode && unitCode.get('requireDetail') == 'M') {
                        return false;
                    } else {
                        return true;
                    }
                }
            }],
            bind: {
                hidden: '{fwaUnitsReadOnly}'
            }
        },
        {
            xtype: 'actioncolumn',
            style: 'border-right: 1px solid #b0b0b0 !important;',
            width: 30,
            resizable: false,
            menuDisabled: true,
            align: 'center',
            items: [{
                reference: 'deleteUnitButton',
                handler: 'deleteUnit',
                iconCls: 'x-fa fa-trash redIcon',
                tooltip: 'Delete'
            }],
            bind: {
                hidden: '{fwaUnitsReadOnly}'
            },
            renderer: function (value, meta, record) {
                meta.style = "border-right: 1px solid #b0b0b0 !important;";
                return;
            }
        }
    ],

    dockedItems: [{
        xtype: 'toolbar',
        style: 'background: #e6e6e6 !important;',
        dock: 'bottom',
        items: [
            {
                xtype: 'button',
                reference: 'newUnitButton',
                itemId: 'newUnitButton',
                handler: 'newUnit',
                iconCls: 'x-fa fa-plus greenIcon',
                isWorkCode: true,
                bind: {
                    hidden: '{fwaUnitsReadOnly}',
                    tooltip: 'Add {settings.unitLabel}'
                }
            }
        ]
    }],


    // bbar: [
    //     {
    //         xtype: 'button',
    //         reference: 'newUnitButton',
    //         itemId: 'newUnitButton',
    //         handler: 'newUnit',
    //         iconCls: 'x-fa fa-plus',
    //         isWorkCode: true,
    //         bind: {
    //             hidden: '{fwaUnitsReadOnly}',
    //             tooltip: 'Add {settings.unitLabel}'
    //         }
    //     }
    // ],

    listeners: {
        edit: 'checkMileage',
        beforeedit: 'checkReadOnly'
    }

});