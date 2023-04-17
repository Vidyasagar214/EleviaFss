/**
 * Created by steve.tess on 7/10/2018.
 */
Ext.define('TS.view.exp.Header', {
    extend: 'Ext.Toolbar',
    xtype: 'header-exp',

    cls: 'toolbar-background',

    items: [
        {
            xtype: 'button',
            width: 70,
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
            style: 'color: white;',
            padding: '0 0 0 20',
            bind: {
                html: '<b>{settings.empName}</b>'
            }
        }, '->', {
            xtype: 'label',
            style: 'color: white;',
            bind: {
                html: '<b>Expense Reports</b>'
            }
        },
        '->',
        {
            iconCls: 'x-fa fa-info-circle',
            width: 25,
            handler: 'openAboutFss',
            tooltip: 'About FSS'
        }
    ]
});