Ext.define('TS.view.fwa.AddUnitsDate', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-addunitsdate',

    controller: 'fwa-edit',
    autoDestroy: true, //custom property implemented in the override

    layout: 'fit',
    items: [
        {
            xtype: 'titlebar',
            docked: 'top',
            cls: 'ts-navigation-header',
            items: [
                {
                    xtype: 'datepickerfield',
                    name: 'unitDate', //this should match dataIndex you would like to edit
                    label: 'Date',
                    reference: 'addUnitDatePicker',
                    itemId: 'addUnitDatePicker'
                }
            ]
        }, {
            xtype: 'titlebar',
            docked: 'bottom',
            cls: 'ts-navigation-header',
            items: [
                {
                    align: 'right',
                    text: 'Close',
                    handler: 'closeSheet'
                },
                {
                    align: 'left',
                    text: 'Save',
                    handler: 'saveAddUnitDate'
                }
            ]
        }
    ]
});