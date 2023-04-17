Ext.define('TS.view.fss.HeaderTwo', {
    extend: 'Ext.panel.Header',
    xtype: 'header-two-fss',

    layout: {
        type: 'vbox'
    },

    style: 'background: white !important; border-bottom: 1px solid lightgrey;',

    items:[
        {
            xtype: 'label',
            style: 'font-weight: bold; font-size: 24px;',
            bind: {
                html: '{settings.empName}'
            },
            padding: '5 0 10 0'
        },
        {
            xtype: 'label',
            html: 'Please select from application(s) below.',
            flex: 1,
            padding: '5 0 10 0'
        }
    ]

});