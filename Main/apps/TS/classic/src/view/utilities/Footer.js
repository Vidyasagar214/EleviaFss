Ext.define('TS.view.utilities.Footer', {
    extend: 'Ext.Toolbar',
    xtype: 'footer-utilities',
    height: 60,
    layout: {
        type: 'hbox',
        pack: 'center',
        align: 'middle'
    },
    //hidden: true,
    style: 'background: #21639C !important;',

    items: [
        '->',
        {
            xtype: 'button',
            width: 70,
            iconCls: 'x-fa fa-home',
            align: 'left',
            handler: 'onBackToFSS'
            //tooltip: 'FSS application list'
        }
    ]

});