/**
 * Created by steve.tess on 6/14/2017.
 */
Ext.define('TS.view.crew.GoToDate', {
    extend: 'Ext.window.Window',
    xtype: 'window-goToDate',

    modal: true,
    layout: 'fit',

    constrainHeader: true,
    //controller: 'panel-scheduler',
    reference: 'goToDate',
    itemId: 'goToDate',

    plugins: 'responsive',
    scrollable: true,

    title: 'Go to Date',
    titleAlign: 'center',
    //
    width: '240px',
    // height: 150,

    items: [
        {
            xtype: 'datepicker', //datefield
            padding: '20 0 20 0',
            itemId: 'goToDateField',
            fieldLabel: '&nbsp;&nbsp;Select Date',
            pickerAlign: 'tl-bl?',
            name: 'goToDate',
            autoShow: true,
            publishes: [
                'value',
                'dirty'
            ],
            listeners: {
                select: 'goToDate' // 'onSelectGoToDate'
            }
        }
    ],

    buttons: [
        '->',
        // {
        //     text: 'Go',
        //     //iconCls: 'save',
        //     itemId: 'goToDateButton',
        //     handler: 'goToDate',
        //     disabled: true,
        //     listeners: {
        //         mouseover: function (btn) {
        //             btn.focus();
        //         }
        //     }
        // },
        {
            text: 'Cancel',
            //iconCls: 'reject-ts',
            handler: 'cancelGoToDate'

        }
    ]
});