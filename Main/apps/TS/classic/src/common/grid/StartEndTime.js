Ext.define('TS.common.grid.StartEndTime', {
    extend: 'Ext.window.Window',
    xtype: 'window-startendtimeeditor',

    controller: 'window-startendtime',

    title: 'Start / End Time',
    width: 600,
    bodyPadding: 10,
    scrollable: 'y',
    modal: true,
    autoShow: true,
    itemId: 'startEndPopoup',
    items: [
        {
            xtype: 'form',
            layout: 'hbox',
            reference: 'startEndTimesForm',
            //padding: '40, 20, 20, 20',
            items:[
                {
                    xtype: 'timefield',
                    fieldLabel: 'Start Time',
                    labelAlign: 'right',
                    editable: true,
                    name: 'startTime',
                    increment: 30,
                    anchor: '100%',
                    padding: '0 10 0 0'
                },
                {
                    xtype: 'timefield',
                    fieldLabel: 'End Time',
                    labelAlign: 'right',
                    editable: true,
                    name: 'endTime',
                    increment: 30,
                    anchor: '100%'
                },
                {
                    xtype: 'textfield',
                    name: 'empId',
                    hidden: true
                },
                {
                    xtype: 'textfield',
                    name: 'workDate',
                    hidden: true
                }
            ]
        }
    ],
    buttons: [{
        text: 'Update',
        handler: 'saveStartEndTime'
    }, {
        text: 'Cancel',
        handler: 'cancelStartEndTime'
    }]
});