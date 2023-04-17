/**
 * Created by steve.tess on 5/8/2017.
 */
Ext.define('TS.view.fwa.AddUnits', {
    extend: 'Ext.window.Window',

    xtype: 'window-addunits',

    modal: true,
    layout: 'fit',

    constrainHeader: true,
    controller: 'grid-units',

    plugins: 'responsive',

    title: {_tr: 'unitLabelPlural', tpl: 'Add {0}'},
    titleAlign: 'center',

    items: [
        {
            xtype: 'form',
            reference: 'addUnitsForm',
            items: [
                {
                    xtype: 'fieldset',
                    title: {_tr: 'unitLabel', tpl: 'Add {0}'},
                    margin: '10 10 10 10',
                    items: [
                        {
                            xtype: 'datefield',
                            reference: 'newUnitDate',
                            fieldLabel: 'Date',
                            pickerAlign: 'tl-bl?',
                            name: 'unitDate',
                            publishes: [
                                'value',
                                'dirty'
                            ]
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'field-unitcode',
                            fieldLabel: {_tr: 'unitLabel', tpl: '{0}'},
                            reference: 'newUnitCode',
                            itemId: 'newUnitCode',
                            bind: {
                                disabled: '{fwaUnitsReadOnly}'
                            },
                            listeners: {
                                change: 'newUnitChanged'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'textfield',
                            reference: 'newUnitCodeName',
                            readOnly: true,
                            fieldLabel: 'Name'
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'numberfield',
                            reference: 'newUnitCodeQty',
                            fieldLabel: 'Qty',
                            minValue: 0,
                            bind: {
                                disabled: '{fwaUnitsReadOnly}'
                            }
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'field-equipment',
                            fieldLabel: 'Equipment',
                            reference: 'newUnitCodeEquipment'
                        },
                        {
                            xtype: 'fixedspacer'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Comments',
                            reference: 'newUnitCodeComments',
                            bind: {
                                disabled: '{fwaUnitsReadOnly}'
                            }
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
            handler: 'saveNewUnit',
            reference: 'saveNewUnitBtn',
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
            handler: 'cancelNewUnit'

        }
    ]
});