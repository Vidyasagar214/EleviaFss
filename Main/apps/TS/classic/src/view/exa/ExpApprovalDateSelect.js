/**
 * Created by steve.tess on 8/16/2018.
 */
Ext.define('TS.view.exa.ExpApprovalDateSelect', {
    extend: 'Ext.window.Window',
    xtype: 'expenseapprovaldateselect',

    controller: 'expapprovaldate',
    viewModel: 'expapprovaldate',

    modal: true,
    layout: 'fit',

    items: [{
        xtype: 'expapprovaldatelist'
    }],

    plugins: 'responsive',
    responsiveConfig: {
        small: {
            width: 225,
            height: 400
        },
        normal: {
            width: 300,
            height: 400
        }
    },

    title: 'Expense Approval Selection'

});