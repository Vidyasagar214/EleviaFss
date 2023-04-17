/**
 * Created by steve.tess on 8/16/2018.
 */
Ext.define('TS.view.exa.Main', {
    extend: 'TS.view.main.Main',

    xtype: 'ts-exa',

    controller: 'exa-main',
    viewModel: 'exa-main',

    items: [
        {
            xtype: 'header-exa'
        },
        {
            xtype: 'panel',
            region: 'center',
            style: 'background-color: #21639C !important;',

            layout: 'fit',
            bind: {
                title: 'Expense Approvals'
            },
            items: [{
                xtype: 'expapprovallist',
                region: 'center',
                reference: 'expApprovalListGrid'
            }],
            header: {
                titlePosition: 0,
                items: [
                    {
                        xtype: 'button',
                        cls: 'button-text',
                        style: 'background: white;',
                        bind: {
                            text: 'View Expense Approval List'
                        },
                        handler: 'showExpApprovalDateSelect'
                    },
                    {
                        xtype: 'button',
                        style: 'background: white;',
                        iconCls: 'x-fa fa-info-circle blackIcon',
                        width: 25,
                        handler: 'openAboutFss',
                        tooltip: 'About FSS'
                    }
                ]
            },
        }
    ]
});