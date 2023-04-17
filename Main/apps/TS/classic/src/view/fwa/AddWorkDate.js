/**
 * Created by steve.tess on 4/5/2017.
 */
Ext.define('TS.view.fwa.AddWorkDate', {
    extend: 'Ext.window.Window',
    xtype: 'window-addworkDate',

    modal: true,
    layout: 'fit',

    constrainHeader: true,
    controller: 'grid-employeehours',
    reference: 'addWorkDate',
    itemId: 'addWorkDate',

    plugins: 'responsive',
    scrollable: true,

    title: 'Add Work Date',
    titleAlign: 'center',

    width: 325,
    height: 150,

    items: [
        {
            xtype: 'datefield',
            padding: '10 0 10 0',
            itemId: 'addWorkDateField',
            fieldLabel: 'Work Date',
            pickerAlign: 'tl-bl?',
            name: 'workDate',
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
            handler: 'saveNewWorkDate',
            listeners: {
                mouseover: function (btn) {
                    btn.focus();
                }
            }
        },
        {
            text: 'Cancel',
            //iconCls: 'reject-ts',
            handler: 'cancelNewWorkDate'

        }
    ]
});