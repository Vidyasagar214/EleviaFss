Ext.define('TS.view.tsa.TsaHeader', {
    extend: 'Ext.panel.Header',
    xtype: 'header-tsa',

    layout: {
        type: 'hbox'
    },

    style: 'background: #21639C !important;color: white; padding-left: 15px;',

    width: '100%',
    bind: {
        title: '{settings.tsTitle} Approvals'
    },

    titlePosition: 0,
    items: [
        {
            xtype: 'button',
            cls: 'button-text',
            style: 'background: white; margin-bottom: 2px;',
            bind: {
                text: 'View {settings.tsTitle} List'
            },
            handler: 'showTimesheetWindow'
        },
        {
            xtype: 'button',
            style: 'background: white; margin-bottom: 2px;',
            iconCls: 'x-fa fa-info-circle blackIcon',
            width: 25,
            handler: 'openAboutFss',
            tooltip: 'About FSS'
        }
    ],

    listeners: {
        'expand': 'fillApprovalGrid'
    }

})
;