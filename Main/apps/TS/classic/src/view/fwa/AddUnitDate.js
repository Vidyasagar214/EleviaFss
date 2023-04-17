/**
 * Created by steve.tess on 1/30/2018.
 */
Ext.define('TS.view.fwa.AddUnitDate', {
    extend: 'Ext.window.Window',
    xtype: 'window-addUnitDate',

    requires: [
        'TS.controller.fwa.UnitsController'
    ],

    modal: true,
    layout: 'fit',

    constrainHeader: true,
    controller: 'grid-units',
    reference: 'addUnitDate',
    itemId: 'addUnitDate',

    plugins: 'responsive',
    scrollable: true,

    title: 'Add Unit Date',
    titleAlign: 'center',

    width: 325,
    height: 150,

    items: [
        {
            xtype: 'datefield',
            padding:'10 0 10 0',
            itemId: 'addUnitDateField',
            fieldLabel: 'Unit Date',
            pickerAlign: 'tl-bl?',
            name: 'unitDate',
            publishes: [
                'value',
                'dirty'
            ]
        }
    ],

    buttons: [
        '->',
        {
            text: 'Save',
            //iconCls: 'save',
            handler: 'saveNewUnitDate',
            listeners: {
                mouseover: function (btn) {
                    btn.focus();
                }
            }
        },
        {
            text: 'Cancel',
            //iconCls: 'reject-ts',
            handler: 'cancelNewUnitDate'

        }
    ]
});