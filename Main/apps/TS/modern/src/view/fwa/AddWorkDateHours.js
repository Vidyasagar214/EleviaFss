/**
 * Created by steve.tess on 4/6/2017.
 */
Ext.define('TS.view.fwa.AddWorkDateHours', {
    extend: 'Ext.Sheet',
    xtype: 'fwa-addworkdatehours',

    requires: [
        'TS.controller.fwa.FWAEditController'
    ],

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
                    name: 'workDate', //this should match dataIndex you would like to edit
                    label: 'Date',
                    reference: 'addWorkDatePicker',
                    itemId: 'addWorkDatePicker'
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
                    handler: 'saveAddWorkDate'
                }
            ]
        }
    ]
});