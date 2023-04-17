Ext.define('TS.view.utilities.Header', {
    extend: 'Ext.panel.Header',
    xtype: 'header-utilities',

    layout: {
        type: 'vbox'
    },


    style: 'background: #21639C !important;',
    items: [
        {
            xtype: 'image',
            imgCls: 'eleviaIcon',
            margin: '0 0 0 0'

        },
        {
            xtype: 'label',
            style: 'font-size: 28px;font-weight: bold; color: white;',
            html: '<b>Utilities</b>',
            flex: 1,
            padding: '10 0 20 0'
        }
    ]
});