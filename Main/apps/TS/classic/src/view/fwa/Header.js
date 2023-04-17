Ext.define('TS.view.fwa.Header', {
    extend: 'Ext.Toolbar',
    xtype: 'header-fwa',

    cls: 'toolbar-background',
    style: 'border-bottom: 1px solid #21639c !important;  min-height: 30px;',
    //minHeight: 30,
    items: [
        {
            xtype: 'button',
            width: 70,
            //cls: 'home-button',
            iconCls: 'x-fa fa-home',
            align: 'left',
            handler: 'onBackToFSS',
            bind: {
                hidden: '{!fromFSS}'
            },
            tooltip: 'FSS application list'
        },
        {
            xtype: 'label',
            style: 'color: white; font-size: 12pt;',
            padding: '0 0 0 20',
            bind: {
                html: '<b>{settings.empName}</b>'
            }
        }, '->', {
            xtype: 'label',
            style: 'color: white; font-size: 12pt',
            bind: {
                html: '<b>{settings.fwaLabelPlural}</b>'
            }
        },
        '->',
        {
            text: '< List View',
            reference: 'fwaGridButtonNew',
            itemId: 'fwaGridButtonNew',
            hidden: true,
            handler: 'backToGrid'
        },
        {
            text: '< List View',
            reference: 'fwaGridButton',
            itemId: 'fwaGridButton',
            hidden: true,
            handler: 'backToGrid'
        },
        {
            text: 'Print All',
            reference: 'fwaPrintButton',
            handler: 'printAll'
        },
        {
            text: {_tr: 'fwaAbbrevLabel', tpl: 'New {0}'},
            itemId: 'newFwaButton',
            reference: 'newFwaButton',
            handler: function () {
                Ext.GlobalEvents.fireEvent('StartNewFwa');
            }
        },
        {
            text: 'Maps',
            reference: 'showFwaMapButton',
            handler: 'showFwaMap'
        },
        {
            iconCls: 'x-fa fa-info-circle',
            width: 25,
            handler: 'openAboutFss',
            tooltip: 'About FSS'
        }
    ]
});
