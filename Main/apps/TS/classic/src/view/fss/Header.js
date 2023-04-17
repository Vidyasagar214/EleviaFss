Ext.define('TS.view.fss.Header', {
    extend: 'Ext.panel.Header',
    xtype: 'header-fss',

    layout: {
        type: 'vbox'
    },

    style: 'background: #21639C !important;',
    //style: 'background: #fff;',
    items: [
        {
            xtype: 'image',
            imgCls: 'eleviaIcon',
            margin: '0 0 0 0'
        },
        {
            xtype: 'label',
            style: 'font-size: 28px;font-weight: bold; color: white;',
            html: '<b>Field Services Suite</b>',
            flex: 1,
            padding: '10 0 20 0'
        },
        {
            // xtype:'panel',
            // layout: 'hbox',
            xtype: 'toolbar',
            hidden: true,
            style:'background: #21639C !important;',
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            width: '100%',
            items:[
                {
                    //xtype: 'button',
                    align: 'left',
                    text: 'Utilities',
                    handler: function () {
                        window.open(TS.app.settings.customerUtilitiesLink);
                    },
                    bind: {
                        hidden:'{!settings.showUtilitiesLink}'
                    }
                },
                '->',
                {
                    //xtype: 'button',
                    text: 'Logout',
                    handler: function () {
                        var existingViewport = Ext.first('viewport');
                        if (existingViewport) {
                            existingViewport.destroy();
                        }
                        Ext.create({
                            xtype: 'window-login'
                        });
                    },
                    hidden: true
                }
            ]
        }

    ]
});