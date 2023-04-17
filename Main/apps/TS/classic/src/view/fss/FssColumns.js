Ext.define('TS.view.fss.Column', {
    extend: 'Ext.panel.Panel',

    xtype: 'layout-column',

    requires: [
        'Ext.layout.container.Column'
    ],
    layout: 'column',

    border: true,

    items:[
        {
            columnWidth: 0.2
        },
        {
            columnWidth: 0.2
        },
        {
            columnWidth: 0.2
        },
        {
            columnWidth: 0.2
        },
        {
            columnWidth: 0.2
        }
    ]
});