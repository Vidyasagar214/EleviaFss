/**
 * Created by steve.tess on 8/21/2018.
 */
Ext.define('TS.view.exa.ExpApprovalExpenseList', {
    extend: 'Ext.window.Window',

    items: [
        {
            xtype: 'panel',
            region: 'center',
            layout: 'fit',
            items: [
                {
                    xtype: 'explist',
                    region: 'center',
                    reference: 'expListGrid'
                }
            ],

            dockedItems: [{
                xtype: 'toolbar-approvalexpenses',
                dock: 'top'
            }]
        }
    ],

    buttons: [
        '->',
        {
            text: 'Close',
            handler: 'onClickClose',
            reference: 'doCloseButton'
        }
    ]
});