/**
 * Created by steve.tess on 7/20/2018.
 */
Ext.define('TS.view.fwa.AddExpenseDetails', {
    extend: 'Ext.window.Window',
    xtype: 'window-addexpensedetails',

    controller: 'addexpensedetails',
    modal: true,
    width: 375,
    height: 350,
    layout: 'fit',
    bodyPadding: 10,
    constrainHeader: true,
    scrollable: 'y',
    title: 'Expense Details',
    titleAlign: 'center',

    items: [
        {
            xtype: 'form',
            scrollable: true,
            reference: 'expenseDetailsForm',
            itemId: 'expenseDetailsForm',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: [
                {
                    xtype: 'textarea',
                    name: 'id',
                    hidden: true
                },
                {
                    xtype: 'textarea',
                    fieldLabel: 'Business reason for expense',
                    name: 'reason',
                    reference: 'reasonField'
                }, {
                    xtype: 'textarea',
                    fieldLabel: 'Travel From/To', //'Name of each person',
                    name: 'other',
                    reference: 'otherField'
                }, {
                    xtype: 'numberfield',
                    fieldLabel: '# Miles',
                    name: 'miles',
                    reference: 'milesField',
                   listeners:{
                        blur: 'setMileageAmount'
                   }
                }, {
                    xtype: 'numberfield',
                    fieldLabel: 'Mileage Rate',
                    readOnly: true,
                    reference: 'amountPerMileField',
                    name: 'amountPerMile'
                }, {
                    xtype: 'numberfield',
                    fieldLabel: 'Amount',
                    reference: 'amountField',
                    name: 'amount',
                    readOnly: true
                }
            ],
            listeners: {
                afterrender: 'afterRenderDetails'
            }
        }
    ],

    buttons: [{
        text: 'Update',
        handler: 'saveDetails',
        reference: 'updateExpenseBtn',
        formBind: true
    }, {
        text: 'Cancel',
        handler: 'cancelDetails'
    }]

});