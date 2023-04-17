/**
 * Created by steve.tess on 8/16/2018.
 */
Ext.define('TS.view.exa.Header', {
    extend: 'Ext.Toolbar',
    xtype: 'header-exa',

    items:[
        {
            xtype: 'button',
            width: 70,
            iconCls: 'x-fa fa-home',
            align: 'left',
            handler: 'onBackToFSS',
            tooltip: 'FSS application list'
        },{
            xtype: 'label',
            style: 'color: white',
            bind: {
                html: '{settings.empName}'
            }
        },
        '->',
        {
            xtype: 'label',
            style: 'color: white;',
            itemId:'approvalDateLabel'
        }
    ]
});